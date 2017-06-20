// Copyright 2017-present 650 Industries. All rights reserved.

#import <AVFoundation/AVFoundation.h>

#import <React/RCTUIManager.h>
#import <React/RCTUtils.h>

#import "EXAV.h"
#import "EXAVPlayerData.h"
#import "EXFileSystem.h"
#import "EXScope.h"
#import "EXVideoView.h"

@interface EXAV ()

@property (nonatomic, assign) BOOL audioIsEnabled;
@property (nonatomic, assign) BOOL audioSessionActive;
@property (nonatomic, assign) BOOL isBackgrounded;

@property (nonatomic, assign) EXAudioInterruptionMode audioInterruptionMode;
@property (nonatomic, assign) BOOL playsInSilentLockedMode;
@property (nonatomic, assign) BOOL allowsAudioRecording;

@property (nonatomic, assign) int soundDictionaryKeyCount;
@property (nonatomic, strong) NSMutableDictionary <NSNumber *, EXAVPlayerData *> *soundDictionary;
@property (nonatomic, strong) NSMutableSet <NSObject<EXAVObject> *> *videoSet;

@property (nonatomic, strong) AVAudioRecorder *audioRecorder;
@property (nonatomic, assign) BOOL audioRecorderIsPreparing;
@property (nonatomic, assign) int audioRecorderDurationMillis;

@end

@implementation EXAV

@synthesize bridge = _bridge;

- (instancetype)init
{
  if ((self = [super init])) {
    _audioIsEnabled = YES;
    _audioSessionActive = NO;
    _isBackgrounded = NO;
    
    _audioInterruptionMode = EXAudioInterruptionModeMixWithOthers;
    _playsInSilentLockedMode = false;
    _allowsAudioRecording = false;
    
    _soundDictionaryKeyCount = 0;
    _soundDictionary = [NSMutableDictionary new];
    _videoSet = [NSMutableSet new];
    
    _audioRecorder = nil;
    _audioRecorderIsPreparing = false;
    _audioRecorderDurationMillis = 0;
    
    // These only need to be set once:
    AVAudioSession *session = [AVAudioSession sharedInstance];
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(_handleAudioSessionInterruption:)
                                                 name:AVAudioSessionInterruptionNotification
                                               object:session];
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(_handleMediaServicesReset)
                                                 name:AVAudioSessionMediaServicesWereResetNotification
                                               object:session];
  }
  
  return self;
}

#pragma mark - Expo experience lifecycle

- (void)setBridge:(RCTBridge *)bridge
{
  _bridge = bridge;
  
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(_bridgeDidForeground:)
                                               name:@"EXKernelBridgeDidForegroundNotification"
                                             object:_bridge];
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(_bridgeDidBackground:)
                                               name:@"EXKernelBridgeDidBackgroundNotification"
                                             object:_bridge];
}

- (void)_bridgeDidForeground:(NSNotification *)notification
{
  _isBackgrounded = NO;
  
  [self _runBlockForAllAVObjects:^(NSObject<EXAVObject> *exAVObject) {
    [exAVObject bridgeDidForeground:notification];
  }];
}

- (void)_bridgeDidBackground:(NSNotification *)notification
{
  _isBackgrounded = YES;
  [self _deactivateAudioSession]; // This will pause all players and stop all recordings
  
  [self _runBlockForAllAVObjects:^(NSObject<EXAVObject> *exAVObject) {
    [exAVObject bridgeDidBackground:notification];
  }];
}

#pragma mark - Global audio state control API

- (void)registerVideoForAudioLifecycle:(NSObject<EXAVObject> *)video
{
  [_videoSet addObject:video];
}

- (void)unregisterVideoForAudioLifecycle:(NSObject<EXAVObject> *)video
{
  [_videoSet removeObject:video];
}

- (void)_runBlockForAllAVObjects:(void (^)(NSObject<EXAVObject> *exAVObject))block
{
  for (EXAVPlayerData *data in [_soundDictionary allValues]) {
    block(data);
  }
  for (NSObject<EXAVObject> *video in [_videoSet allObjects]) {
    block(video);
  }
}

// This method is placed here so that it is easily referrable from _setAudioSessionCategoryForAudioMode.
- (NSError *)_setAudioMode:(NSDictionary *)mode
{
  BOOL playsInSilentLockedMode = ((NSNumber *)mode[@"playsInSilentLockedModeIOS"]).boolValue;
  EXAudioInterruptionMode interruptionMode = ((NSNumber *)mode[@"interruptionModeIOS"]).intValue;
  BOOL allowsRecording = ((NSNumber *)mode[@"allowsRecordingIOS"]).boolValue;
  
  if (!playsInSilentLockedMode && interruptionMode == EXAudioInterruptionModeDuckOthers) {
    return RCTErrorWithMessage(@"Impossible audio mode: playsInSilentLockedMode and duckOthers cannot both be set on iOS.");
  } else if (!playsInSilentLockedMode && allowsRecording) {
    return RCTErrorWithMessage(@"Impossible audio mode: playsInSilentLockedMode and allowsRecording cannot both be set on iOS.");
  } else {
    if (!allowsRecording) {
      if (_audioRecorder && [_audioRecorder isRecording]) {
        [_audioRecorder pause];
      }
    }
    
    _playsInSilentLockedMode = playsInSilentLockedMode;
    _audioInterruptionMode = interruptionMode;
    _allowsAudioRecording = allowsRecording;
    
    NSError *error;
    if (_audioSessionActive) {
      [self _setAudioSessionCategoryForAudioMode:&error];
    }
    
    return error;
  }
}

- (void)_setAudioSessionCategoryForAudioMode:(NSError **)error
{
  AVAudioSession *session = [AVAudioSession sharedInstance];
  
  if (!_playsInSilentLockedMode) {
    // _allowsRecording is guaranteed to be false, and _interruptionMode is guaranteed to not be EXAudioInterruptionModeDuckOthers (see above)
    if (_audioInterruptionMode == EXAudioInterruptionModeDoNotMix) {
      [session setCategory:AVAudioSessionCategorySoloAmbient error:error];
    } else {
      [session setCategory:AVAudioSessionCategoryAmbient error:error];
    }
  } else {
    NSString *category = _allowsAudioRecording ? AVAudioSessionCategoryPlayAndRecord : AVAudioSessionCategoryPlayback;
    switch (_audioInterruptionMode) {
      case EXAudioInterruptionModeDoNotMix:
        [session setCategory:category error:error];
        break;
      case EXAudioInterruptionModeDuckOthers:
        [session setCategory:category withOptions:AVAudioSessionCategoryOptionDuckOthers error:error];
        break;
      case EXAudioInterruptionModeMixWithOthers:
      default:
        [session setCategory:category withOptions:AVAudioSessionCategoryOptionMixWithOthers error:error];
        break;
    }
  }
}

- (NSError *)activateAudioSessionIfNecessary
{
  if (!_audioIsEnabled) {
    return RCTErrorWithMessage(@"Expo Audio is disabled, so the audio session could not be activated.");
  }
  if (_isBackgrounded) {
    return RCTErrorWithMessage(@"This experience is currently in the background, so the audio session could not be activated.");
  }
  
  if (_audioSessionActive) {
    return nil;
  }
  
  NSError *error;
  AVAudioSession *session = [AVAudioSession sharedInstance];
  [session setActive:YES error:&error];
  if (!error) {
    _audioSessionActive = YES;
    [self _setAudioSessionCategoryForAudioMode:&error];
  }
  return error;
}

- (NSError *)_deactivateAudioSession
{
  if (!_audioSessionActive) {
    return nil;
  }
  
  // We must have all players, recorders, and videos paused in order to effectively deactivate the session.
  [self _runBlockForAllAVObjects:^(NSObject<EXAVObject> *exAVObject) {
    [exAVObject pauseImmediately];
  }];
  if (_audioRecorder && [_audioRecorder isRecording]) {
    [_audioRecorder pause];
  }
  
  NSError *error;
  AVAudioSession *session = [AVAudioSession sharedInstance];
  // Restore the AVAudioSession to the system default for proper sandboxing.
  [session setCategory:AVAudioSessionCategorySoloAmbient error:&error];
  [session setActive:NO error:&error];
  if (!error) {
    _audioSessionActive = NO;
  }
  return error;
}

- (NSError *)deactivateAudioSessionIfUnused
{
  __block BOOL audioSessionIsInUse = NO;
  
  [self _runBlockForAllAVObjects:^(NSObject<EXAVObject> *exAVObject) {
    if ([exAVObject isUsingAudioSession]) {
      audioSessionIsInUse = YES;
    }
  }];
  
  if (_audioRecorder && ([_audioRecorder isRecording] || _audioRecorderIsPreparing)) {
    audioSessionIsInUse = YES;
  }
  
  return audioSessionIsInUse ? nil : [self _deactivateAudioSession];
}

- (void)_handleAudioSessionInterruption:(NSNotification*)notification
{
  NSNumber *interruptionType = [[notification userInfo] objectForKey:AVAudioSessionInterruptionTypeKey];
  if (interruptionType.unsignedIntegerValue == AVAudioSessionInterruptionTypeBegan) {
    _audioSessionActive = NO;
  }
  
  [self _runBlockForAllAVObjects:^(NSObject<EXAVObject> *exAVObject) {
    [exAVObject handleAudioSessionInterruption:notification];
  }];
}

- (void)_handleMediaServicesReset
{
  // See here: https://developer.apple.com/library/content/qa/qa1749/_index.html
  // (this is an unlikely notification to receive, but best practices suggests that we catch it just in case)
  
  _audioSessionActive = NO;
  
  [self _runBlockForAllAVObjects:^(NSObject<EXAVObject> *exAVObject) {
    [exAVObject handleMediaServicesReset:nil];
  }];
  
  if (_audioRecorder) {
    [self _createNewAudioRecorder]; // TODO What should we do with old data here?
    [_audioRecorder prepareToRecord];
  }
}

#pragma mark - Internal sound playback helper methods

- (void)_runBlock:(void (^)(EXAVPlayerData *data))block
  withSoundForKey:(nonnull NSNumber *)key
     withRejecter:(RCTPromiseRejectBlock)reject
{
  EXAVPlayerData *data = _soundDictionary[key];
  if (data) {
    block(data);
  } else {
    reject(@"E_AUDIO_NOPLAYER", nil, RCTErrorWithMessage(@"Player does not exist."));
  }
}

- (void)_removeSoundForKey:(NSNumber *)key
{
  EXAVPlayerData *data = _soundDictionary[key];
  if (data) {
    [data pauseImmediately];
    [self deactivateAudioSessionIfUnused];
  }
  _soundDictionary[key] = nil;
}

#pragma mark - Internal video playback helper method

- (void)_runBlock:(void (^)(EXVideoView *view))block
withEXVideoViewForTag:(nonnull NSNumber *)reactTag
     withRejecter:(RCTPromiseRejectBlock)reject
{
  dispatch_async(dispatch_get_main_queue(), ^{
    UIView *view = [_bridge.uiManager viewForReactTag:reactTag];
    if ([view isKindOfClass:[EXVideoView class]]) {
      dispatch_async(RCTGetUIManagerQueue(), ^{
        block((EXVideoView *)view);
      });
    } else {
      NSString *errorMessage = [NSString stringWithFormat:@"Invalid view returned from registry, expecting EXVideo, got: %@", view];
      reject(@"E_VIDEO_TAGINCORRECT", nil, RCTErrorWithMessage(errorMessage));
    }
  });
}

#pragma mark - Internal audio recording helper methods

- (void)_createNewAudioRecorder
{
  [self _removeAudioRecorder];
  
  NSString *filename = [NSString stringWithFormat:@"recording-%@.caf", [[NSUUID UUID] UUIDString]];
  [EXFileSystem ensureDirExistsWithPath:[self.bridge.experienceScope scopedPathWithPath:@"AV"
                                                                            withOptions:@{@"cache": @YES}]];
  NSString *soundFilePath = [self.bridge.experienceScope scopedPathWithPath:[@"AV" stringByAppendingPathComponent:filename]
                                                                withOptions:@{@"cache": @(YES)}];
  NSURL *soundFileURL = [NSURL fileURLWithPath:soundFilePath];
  
  NSDictionary *recordSettings = @{AVEncoderAudioQualityKey: @(AVAudioQualityMedium),
                                   AVEncoderBitRateKey: @(128000),
                                   AVNumberOfChannelsKey: @(2),
                                   AVSampleRateKey: @(44100.0)};
  
  NSError *error;
  AVAudioRecorder *recorder = [[AVAudioRecorder alloc] initWithURL:soundFileURL
                                                          settings:recordSettings
                                                             error:&error];
  if (error == nil) {
    _audioRecorder = recorder;
  }
}

- (int)_getDurationMillisOfRecordingAudioRecorder
{
  return _audioRecorder ? (int) (_audioRecorder.currentTime * 1000) : 0;
}

- (NSDictionary *)_getAudioRecorderStatus
{
  if (_audioRecorder) {
    int durationMillisFromRecorder = [self _getDurationMillisOfRecordingAudioRecorder];
    // After stop, the recorder's duration goes to zero, so we replace it with the correct duration in this case.
    int durationMillis = durationMillisFromRecorder == 0 ? _audioRecorderDurationMillis : durationMillisFromRecorder;
    return @{@"canRecord": @(YES),
             @"isRecording": @([_audioRecorder isRecording]),
             @"durationMillis": @(durationMillis)};
  } else {
    return nil;
  }
}

- (BOOL)_checkAudioRecorderExistsOrReject:(RCTPromiseRejectBlock)reject
{
  if (_audioRecorder == nil) {
    reject(@"E_AUDIO_NORECORDER", nil, RCTErrorWithMessage(@"Recorder does not exist."));
  }
  return _audioRecorder != nil;
}

- (void)_removeAudioRecorder
{
  if (_audioRecorder) {
    [_audioRecorder stop];
    [self deactivateAudioSessionIfUnused];
    _audioRecorder = nil;
  }
}

RCT_EXPORT_MODULE(ExponentAV);

#pragma mark - Audio API: Global settings

RCT_EXPORT_METHOD(setAudioIsEnabled:(BOOL)value
                           resolver:(RCTPromiseResolveBlock)resolve
                           rejecter:(RCTPromiseRejectBlock)reject)
{
  _audioIsEnabled = value;
  
  if (!value) {
    [self _deactivateAudioSession];
  }
  resolve(nil);
}

RCT_EXPORT_METHOD(setAudioMode:(nonnull NSDictionary *)mode
                      resolver:(RCTPromiseResolveBlock)resolve
                      rejecter:(RCTPromiseRejectBlock)reject)
{
  NSError *error = [self _setAudioMode:mode];
  
  if (error) {
    reject(@"E_AUDIO_AUDIOMODE", nil, error);
  } else {
    resolve(nil);
  }
}

#pragma mark - Unified playback API - Audio

RCT_EXPORT_METHOD(loadForSound:(nonnull NSString *)uriString
                    withStatus:(nonnull NSDictionary *)status
                   withSuccess:(RCTResponseSenderBlock)loadSuccess
                     withError:(RCTResponseSenderBlock)loadError)
{
  NSNumber *key = @(_soundDictionaryKeyCount++);
  __weak __typeof__(self) weakSelf = self;
  EXAVPlayerData *data = [[EXAVPlayerData alloc] initWithEXAV:self
                                                      withURL:[NSURL URLWithString:uriString]
                                                   withStatus:status
                                         withLoadFinishBlock:^(BOOL success, NSDictionary *successStatus, NSString *error) {
                                           if (success) {
                                             loadSuccess(@[key, successStatus]);
                                           } else {
                                             [weakSelf _removeSoundForKey:key];
                                             loadError(@[error]);
                                           }
                                         }];
  data.errorCallback = ^(NSString *error) {
    [self _removeSoundForKey:key];
  };
  _soundDictionary[key] = data;
}

RCT_EXPORT_METHOD(unloadForSound:(nonnull NSNumber *)key
                        resolver:(RCTPromiseResolveBlock)resolve
                        rejecter:(RCTPromiseRejectBlock)reject)
{
  [self _runBlock:^(EXAVPlayerData *data) {
    [self _removeSoundForKey:key];
    resolve([EXAVPlayerData getUnloadedStatus]);
  } withSoundForKey:key withRejecter:reject];
}

RCT_EXPORT_METHOD(setStatusForSound:(nonnull NSNumber *)key
                         withStatus:(nonnull NSDictionary *)status
                           resolver:(RCTPromiseResolveBlock)resolve
                           rejecter:(RCTPromiseRejectBlock)reject)
{
  [self _runBlock:^(EXAVPlayerData *data) {
    [data setStatus:status
           resolver:resolve
           rejecter:reject];
  } withSoundForKey:key withRejecter:reject];
}

RCT_EXPORT_METHOD(getStatusForSound:(nonnull NSNumber *)key
                           resolver:(RCTPromiseResolveBlock)resolve
                           rejecter:(RCTPromiseRejectBlock)reject)
{
  [self _runBlock:^(EXAVPlayerData *data) {
    NSDictionary *status = [data getStatus];
    resolve(status);
  } withSoundForKey:key withRejecter:reject];
}

RCT_EXPORT_METHOD(setStatusUpdateCallbackForSound:(nonnull NSNumber *)key
                                     withCallback:(RCTResponseSenderBlock)callback)
{
  EXAVPlayerData *data = _soundDictionary[key];
  if (data) {
    __block BOOL used = NO; // RCTResponseSenderBlock can only be used once
    data.statusUpdateCallback = ^(NSDictionary *status) {
      if (!used) {
        used = YES;
        callback(@[status]);
      }
    };
  }
}

RCT_EXPORT_METHOD(setErrorCallbackForSound:(nonnull NSNumber *)key
                              withCallback:(RCTResponseSenderBlock)callback)
{
  EXAVPlayerData *data = _soundDictionary[key];
  if (data) {
    __block BOOL used = NO; // RCTResponseSenderBlock can only be used once
    data.errorCallback = ^(NSString *error) {
      if (!used) {
        used = YES;
        [self _removeSoundForKey:key];
        callback(@[error]);
      }
    };
  }
}

#pragma mark - Unified playback API - Video

RCT_EXPORT_METHOD(loadForVideo:(nonnull NSNumber *)reactTag
                           uri:(nonnull NSString *)uriString
                    withStatus:(nonnull NSDictionary *)status
                      resolver:(RCTPromiseResolveBlock)resolve
                      rejecter:(RCTPromiseRejectBlock)reject)
{
  [self _runBlock:^(EXVideoView *view) {
    [view setUri:uriString withStatus:status resolver:resolve rejecter:reject];
  } withEXVideoViewForTag:reactTag withRejecter:reject];
}

RCT_EXPORT_METHOD(unloadForVideo:(nonnull NSNumber *)reactTag
                        resolver:(RCTPromiseResolveBlock)resolve
                        rejecter:(RCTPromiseRejectBlock)reject)
{
  [self _runBlock:^(EXVideoView *view) {
    [view setUri:nil withStatus:nil resolver:resolve rejecter:reject];
  } withEXVideoViewForTag:reactTag withRejecter:reject];
}

RCT_EXPORT_METHOD(setStatusForVideo:(nonnull NSNumber *)reactTag
                         withStatus:(nonnull NSDictionary *)status
                           resolver:(RCTPromiseResolveBlock)resolve
                           rejecter:(RCTPromiseRejectBlock)reject)
{
  [self _runBlock:^(EXVideoView *view) {
    [view setStatus:status resolver:resolve rejecter:reject];
  } withEXVideoViewForTag:reactTag withRejecter:reject];
}

RCT_EXPORT_METHOD(getStatusForVideo:(nonnull NSNumber *)reactTag
                           resolver:(RCTPromiseResolveBlock)resolve
                           rejecter:(RCTPromiseRejectBlock)reject)
{
  [self _runBlock:^(EXVideoView *view) {
    resolve(view.status);
  } withEXVideoViewForTag:reactTag withRejecter:reject];
}

// Note that setStatusUpdateCallback happens in the JS for video via onStatusUpdate

#pragma mark - Audio API: Recording

RCT_EXPORT_METHOD(prepareAudioRecorder:(RCTPromiseResolveBlock)resolve
                              rejecter:(RCTPromiseRejectBlock)reject)
{
  [self _createNewAudioRecorder];
  
  if (_audioRecorder) {
    _audioRecorderIsPreparing = true;
    NSError *error = [self activateAudioSessionIfNecessary];
    if (error) {
      reject(@"E_AUDIO_RECORDERNOTCREATED", @"Prepare encountered an error: audio session not activated!", error);
    } else if ([_audioRecorder prepareToRecord]) {
      resolve(@{@"uri": [[_audioRecorder url] absoluteString],
                @"status": [self _getAudioRecorderStatus]});
    } else {
      reject(@"E_AUDIO_RECORDERNOTCREATED", nil, RCTErrorWithMessage(@"Prepare encountered an error: recorder not prepared."));
    }
    _audioRecorderIsPreparing = false;
    [self deactivateAudioSessionIfUnused];
  } else {
    reject(@"E_AUDIO_RECORDERNOTCREATED", nil, RCTErrorWithMessage(@"Prepare encountered an error: recorder not created."));
  }
}

RCT_EXPORT_METHOD(startAudioRecording:(RCTPromiseResolveBlock)resolve
                             rejecter:(RCTPromiseRejectBlock)reject)
{
  if ([self _checkAudioRecorderExistsOrReject:reject]) {
    if (!_allowsAudioRecording) {
      reject(@"E_AUDIO_AUDIOMODE", nil, RCTErrorWithMessage(@"Recording not allowed on iOS."));
    } else if (!_audioRecorder.recording) {
      NSError *error = [self activateAudioSessionIfNecessary];
      if (!error) {
        if ([_audioRecorder record]) {
          resolve([self _getAudioRecorderStatus]);
        } else {
          reject(@"E_AUDIO_RECORDING", nil, RCTErrorWithMessage(@"Start encountered an error: recording not started."));
        }
      } else {
        reject(@"E_AUDIO_RECORDING", @"Start encountered an error: audio session not activated.", error);
      }
    }
  }
}

RCT_EXPORT_METHOD(pauseAudioRecording:(RCTPromiseResolveBlock)resolve
                             rejecter:(RCTPromiseRejectBlock)reject)
{
  if ([self _checkAudioRecorderExistsOrReject:reject]) {
    if (_audioRecorder.recording) {
      [_audioRecorder pause];
      [self deactivateAudioSessionIfUnused];
    }
    resolve([self _getAudioRecorderStatus]);
  }
}

RCT_EXPORT_METHOD(stopAudioRecording:(RCTPromiseResolveBlock)resolve
                            rejecter:(RCTPromiseRejectBlock)reject)
{
  if ([self _checkAudioRecorderExistsOrReject:reject]) {
    if (_audioRecorder.recording) {
      _audioRecorderDurationMillis = [self _getDurationMillisOfRecordingAudioRecorder];
      [_audioRecorder stop];
      [self deactivateAudioSessionIfUnused];
    }
    resolve([self _getAudioRecorderStatus]);
  }
}

RCT_EXPORT_METHOD(getAudioRecordingStatus:(RCTPromiseResolveBlock)resolve
                                 rejecter:(RCTPromiseRejectBlock)reject)
{
  if ([self _checkAudioRecorderExistsOrReject:reject]) {
    resolve([self _getAudioRecorderStatus]);
  }
}

RCT_EXPORT_METHOD(unloadAudioRecorder:(RCTPromiseResolveBlock)resolve
                             rejecter:(RCTPromiseRejectBlock)reject)
{
  if ([self _checkAudioRecorderExistsOrReject:reject]) {
    [self _removeAudioRecorder];
    resolve(nil);
  }
}

#pragma mark - Lifecycle

- (void)dealloc
{
  [[NSNotificationCenter defaultCenter] removeObserver:self];
  
  // This will clear all @properties and deactivate the audio session:
  
  for (NSObject<EXAVObject> *video in [_videoSet allObjects]) {
    [video pauseImmediately];
    [_videoSet removeObject:video];
  }
  [self _removeAudioRecorder];
  for (NSNumber *key in [_soundDictionary allKeys]) {
    [self _removeSoundForKey:key];
  }
}


@end
