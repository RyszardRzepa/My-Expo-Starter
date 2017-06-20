// Copyright 2017-present 650 Industries. All rights reserved.

#import <React/RCTUtils.h>

#import "EXAVPlayerData.h"

NSString *const EXAVPlayerDataStatusIsLoadedKeyPath = @"isLoaded";
NSString *const EXAVPlayerDataStatusURIKeyPath = @"uri";
NSString *const EXAVPlayerDataStatusProgressUpdateIntervalMillisKeyPath = @"progressUpdateIntervalMillis";
NSString *const EXAVPlayerDataStatusDurationMillisKeyPath = @"durationMillis";
NSString *const EXAVPlayerDataStatusPositionMillisKeyPath = @"positionMillis";
NSString *const EXAVPlayerDataStatusPlayableDurationMillisKeyPath = @"playableDurationMillis";
NSString *const EXAVPlayerDataStatusShouldPlayKeyPath = @"shouldPlay";
NSString *const EXAVPlayerDataStatusIsPlayingKeyPath = @"isPlaying";
NSString *const EXAVPlayerDataStatusIsBufferingKeyPath = @"isBuffering";
NSString *const EXAVPlayerDataStatusRateKeyPath = @"rate";
NSString *const EXAVPlayerDataStatusShouldCorrectPitchKeyPath = @"shouldCorrectPitch";
NSString *const EXAVPlayerDataStatusVolumeKeyPath = @"volume";
NSString *const EXAVPlayerDataStatusIsMutedKeyPath = @"isMuted";
NSString *const EXAVPlayerDataStatusIsLoopingKeyPath = @"isLooping";
NSString *const EXAVPlayerDataStatusDidJustFinishKeyPath = @"didJustFinish";

NSString *const EXAVPlayerDataObserverStatusKeyPath = @"status";
NSString *const EXAVPlayerDataObserverRateKeyPath = @"rate";
NSString *const EXAVPlayerDataObserverTimeControlStatusPath = @"timeControlStatus";
NSString *const EXAVPlayerDataObserverPlaybackBufferEmptyKeyPath = @"playbackBufferEmpty";

@interface EXAVPlayerData ()

@property (nonatomic, weak) EXAV *exAV;

@property (nonatomic, assign) BOOL isLoaded;
@property (nonatomic, strong) void (^loadFinishBlock)(BOOL success, NSDictionary *successStatus, NSString *error);

@property (nonatomic, strong) id <NSObject> timeObserver;
@property (nonatomic, strong) id <NSObject> finishObserver;
@property (nonatomic, strong) id <NSObject> playbackStalledObserver;

@property (nonatomic, strong) NSNumber *progressUpdateIntervalMillis;
@property (nonatomic, assign) CMTime currentPosition;
@property (nonatomic, assign) BOOL shouldPlay;
@property (nonatomic, strong) NSNumber *rate;
@property (nonatomic, assign) BOOL shouldCorrectPitch;
@property (nonatomic, strong) NSNumber* volume;
@property (nonatomic, assign) BOOL isMuted;
@property (nonatomic, assign) BOOL isLooping;

@end

@implementation EXAVPlayerData

#pragma mark - Static methods

+ (NSDictionary *)getUnloadedStatus
{
  return @{EXAVPlayerDataStatusIsLoadedKeyPath: @(NO)};
}

#pragma mark - Init and player loading

- (instancetype)initWithEXAV:(EXAV *)exAV
                     withURL:(NSURL *)url
                  withStatus:(NSDictionary *)parameters
         withLoadFinishBlock:(void (^)(BOOL success, NSDictionary *successStatus, NSString *error))loadFinishBlock
{
  if ((self = [super init])) {
    _exAV = exAV;
  
    _isLoaded = NO;
    _loadFinishBlock = loadFinishBlock;
  
    _player = nil;
  
    _url = url;
  
    _timeObserver = nil;
    _finishObserver = nil;
    _playbackStalledObserver = nil;
    _statusUpdateCallback = nil;
  
    // These status props will be potentialy reset by the following call to [self setStatus:parameters ...].
    _progressUpdateIntervalMillis = @(500);
    _currentPosition = kCMTimeZero;
    _shouldPlay = NO;
    _rate = @(1.0);
    _shouldCorrectPitch = NO;
    _volume = @(1.0);
    _isMuted = NO;
    _isLooping = NO;
  
    [self setStatus:parameters resolver:nil rejecter:nil];
  
    [self _loadNewPlayer];
  }
  
  return self;
}

- (void)_loadNewPlayer
{
  NSArray *cookies = [[NSHTTPCookieStorage sharedHTTPCookieStorage] cookies];
  AVURLAsset *avAsset = [AVURLAsset URLAssetWithURL:_url options:@{AVURLAssetHTTPCookiesKey : cookies}];
  
  // unless we preload, the asset will not necessarily load the duration by the time we try to play it.
  // http://stackoverflow.com/questions/20581567/avplayer-and-avfoundationerrordomain-code-11819
  __weak __typeof__(self) weakSelf = self;
  [avAsset loadValuesAsynchronouslyForKeys:@[ @"duration" ] completionHandler:^{
    AVPlayerItem *playerItem = [AVPlayerItem playerItemWithAsset:avAsset];
    weakSelf.player = [AVPlayer playerWithPlayerItem:playerItem];
    if (weakSelf.player) {
      [weakSelf.player addObserver:weakSelf forKeyPath:EXAVPlayerDataObserverStatusKeyPath options:0 context:nil];
      [playerItem addObserver:weakSelf forKeyPath:EXAVPlayerDataObserverStatusKeyPath options:0 context:nil];
    } else {
      NSString *errorMessage = @"Load encountered an error: [AVPlayer playerWithPlayerItem:] returned nil.";
      if (weakSelf.loadFinishBlock) {
        weakSelf.loadFinishBlock(NO, nil, errorMessage);
        weakSelf.loadFinishBlock = nil;
      } else if (weakSelf.errorCallback) {
        weakSelf.errorCallback(errorMessage);
      }
    }
  }];
}

- (void)_finishLoadingNewPlayer
{
  // Set up player with parameters
  __weak __typeof__(self) weakSelf = self;
  [_player seekToTime:_currentPosition completionHandler:^(BOOL finished) {
    weakSelf.currentPosition = weakSelf.player.currentTime;
    
    if (weakSelf.shouldCorrectPitch) {
      weakSelf.player.currentItem.audioTimePitchAlgorithm = AVAudioTimePitchAlgorithmLowQualityZeroLatency;
    } else {
      weakSelf.player.currentItem.audioTimePitchAlgorithm = AVAudioTimePitchAlgorithmVarispeed;
    }
    weakSelf.player.volume = weakSelf.volume.floatValue;
    weakSelf.player.muted = weakSelf.isMuted;
    weakSelf.player.actionAtItemEnd = AVPlayerActionAtItemEndNone;
    
    if (weakSelf.shouldPlay) {
      NSError *error = [weakSelf.exAV activateAudioSessionIfNecessary];
      if (error == nil) {
        weakSelf.player.rate = [weakSelf.rate floatValue];
      }
    }
    
    weakSelf.isLoaded = YES;
    [weakSelf _addObserversForNewPlayer];
    
    if (weakSelf.loadFinishBlock) {
      weakSelf.loadFinishBlock(YES, [weakSelf getStatus], nil);
      weakSelf.loadFinishBlock = nil;
    }
  }];
}

#pragma mark - setStatus

- (NSError *)_playPlayerWithRate
{
  if (_player) {
    NSError *error = [_exAV activateAudioSessionIfNecessary];
    if (!error) {
      _player.rate = [_rate floatValue];
    }
    return error;
  }
  return nil;
}

- (void)setStatus:(NSDictionary *)parameters
         resolver:(RCTPromiseResolveBlock)resolve
         rejecter:(RCTPromiseRejectBlock)reject
{
  BOOL mustUpdateTimeObserver = NO;
  BOOL mustSeek = NO;
  BOOL mustResetPlayerRate = NO;
  
  if ([parameters objectForKey:EXAVPlayerDataStatusProgressUpdateIntervalMillisKeyPath] != nil) {
    NSNumber *progressUpdateIntervalMillis = parameters[EXAVPlayerDataStatusProgressUpdateIntervalMillisKeyPath];
    mustUpdateTimeObserver = ![progressUpdateIntervalMillis isEqualToNumber:_progressUpdateIntervalMillis];
    _progressUpdateIntervalMillis = progressUpdateIntervalMillis;
  }
  
  // To prevent a race condition, we set _currentPosition at the end of this method.
  CMTime newPosition = _currentPosition;
  
  if ([parameters objectForKey:EXAVPlayerDataStatusPositionMillisKeyPath] != nil) {
    NSNumber *currentPositionMillis = parameters[EXAVPlayerDataStatusPositionMillisKeyPath];
    
    // We only seek if the new position is different from _currentPosition by a whole number of milliseconds.
    mustSeek = currentPositionMillis.longValue != [self _getRoundedMillisFromCMTime:_currentPosition].longValue;
    if (mustSeek) {
      newPosition = CMTimeMakeWithSeconds(currentPositionMillis.floatValue / 1000, NSEC_PER_SEC);
    }
  }
  
  if ([parameters objectForKey:EXAVPlayerDataStatusShouldPlayKeyPath] != nil) {
    NSNumber *shouldPlay = parameters[EXAVPlayerDataStatusShouldPlayKeyPath];
    mustResetPlayerRate = shouldPlay.boolValue != _shouldPlay;
    _shouldPlay = shouldPlay.boolValue;
  }
  
  if ([parameters objectForKey:EXAVPlayerDataStatusRateKeyPath] != nil) {
    NSNumber *rate = parameters[EXAVPlayerDataStatusRateKeyPath];
    if (_shouldPlay && ![rate isEqualToNumber:_rate]) {
      mustResetPlayerRate = YES;
    }
    _rate = rate;
  }
  if ([parameters objectForKey:EXAVPlayerDataStatusShouldCorrectPitchKeyPath] != nil) {
    NSNumber *shouldCorrectPitch = parameters[EXAVPlayerDataStatusShouldCorrectPitchKeyPath];
    _shouldCorrectPitch = shouldCorrectPitch.boolValue;
  }
  if ([parameters objectForKey:EXAVPlayerDataStatusVolumeKeyPath] != nil) {
    NSNumber *volume = parameters[EXAVPlayerDataStatusVolumeKeyPath];
    _volume = volume;
  }
  if ([parameters objectForKey:EXAVPlayerDataStatusIsMutedKeyPath] != nil) {
    NSNumber *isMuted = parameters[EXAVPlayerDataStatusIsMutedKeyPath];
    _isMuted = isMuted.boolValue;
  }
  if ([parameters objectForKey:EXAVPlayerDataStatusIsLoopingKeyPath] != nil) {
    NSNumber *isLooping = parameters[EXAVPlayerDataStatusIsLoopingKeyPath];
    _isLooping = isLooping.boolValue;
  }
  
  if (_player && _isLoaded) {
    // Pause first if necessary.
    if (!_shouldPlay && mustResetPlayerRate) {
      [_player pause];
      [_exAV deactivateAudioSessionIfUnused];
    }
    
    // Apply idempotent parameters.
    if (_shouldCorrectPitch) {
      _player.currentItem.audioTimePitchAlgorithm = AVAudioTimePitchAlgorithmLowQualityZeroLatency;
    } else {
      _player.currentItem.audioTimePitchAlgorithm = AVAudioTimePitchAlgorithmVarispeed;
    }
    _player.volume = _volume.floatValue;
    _player.muted = _isMuted;
    
    // Apply parameters necessary after seek.
    __weak __typeof__(self) weakSelf = self;
    void (^applyPostSeekParameters)(BOOL) = ^(BOOL success) {
      weakSelf.currentPosition = weakSelf.player.currentTime;
      
      if (mustUpdateTimeObserver) {
        [weakSelf _updateTimeObserver];
      }
      
      if (weakSelf.shouldPlay && mustResetPlayerRate) {
        NSError *error = [weakSelf _playPlayerWithRate];
        if (error) {
          if (reject) {
            reject(@"E_AV_PLAY", @"Play encountered an error: audio session not activated.", error);
          } else {
            [self _callStatusUpdateCallback];
          }
          return;
        }
      }
      if (success) {
        if (resolve) {
          resolve([weakSelf getStatus]);
        }
      } else if (reject) {
        reject(@"E_AV_SEEKING", nil, RCTErrorWithMessage(@"Seeking interrupted."));
      }
      
      if (!resolve || !reject) {
        [self _callStatusUpdateCallback];
      }
    };
    
    // Apply seek if necessary.
    if (mustSeek) {
      [_player seekToTime:newPosition completionHandler:applyPostSeekParameters];
    } else {
      applyPostSeekParameters(YES);
    }
  } else {
    _currentPosition = newPosition; // Will be set in the new _player on the call to [self _finishLoadingNewPlayer].
    if (resolve) {
      resolve([EXAVPlayerData getUnloadedStatus]);
    }
  }
}

#pragma mark - getStatus

- (BOOL)_isPlayerPlaying
{
  if ([_player respondsToSelector:@selector(timeControlStatus)]) {
    // Only available after iOS 10
    return [_player timeControlStatus] == AVPlayerTimeControlStatusPlaying;
  } else {
    // timeControlStatus is preferable to this when available
    // See http://stackoverflow.com/questions/5655864/check-play-state-of-avplayer
    return _player.rate != 0 && _player.error == nil;
  }
}

- (NSNumber *)_getRoundedMillisFromCMTime:(CMTime)time
{
  return @((long) (CMTimeGetSeconds(time) * 1000));
}

- (NSNumber *)_getClippedValueForValue:value withMin:(NSNumber *)min withMax:(NSNumber *)max
{
  return [value compare:min] == NSOrderedAscending ? min : [value compare:max] == NSOrderedDescending ? max : value;
}

- (NSDictionary *)getStatus
{
  if (!_isLoaded || _player == nil) {
    return [EXAVPlayerData getUnloadedStatus];
  }
  
  AVPlayerItem *currentItem = _player.currentItem;
  if (_player.status != AVPlayerStatusReadyToPlay || currentItem.status != AVPlayerItemStatusReadyToPlay) {
    return [EXAVPlayerData getUnloadedStatus];
  }
  
  // Get duration and position:
  
  NSNumber *durationMillis = [self _getRoundedMillisFromCMTime:currentItem.duration];
  durationMillis = [durationMillis compare:@(0)] == NSOrderedAscending ? 0 : durationMillis;
  
  NSNumber *positionMillis = [self _getRoundedMillisFromCMTime:[_player currentTime]];
  positionMillis = [self _getClippedValueForValue:positionMillis withMin:@(0) withMax:durationMillis];
  
  // Calculate playable + seekable durations:
  
  NSNumber *playableDurationMillis = @(0);
  if (_player.status == AVPlayerStatusReadyToPlay) {
    __block CMTimeRange effectiveTimeRange;
    [currentItem.loadedTimeRanges enumerateObjectsUsingBlock:^(id obj, NSUInteger idx, BOOL *stop) {
      CMTimeRange timeRange = [obj CMTimeRangeValue];
      if (CMTimeRangeContainsTime(timeRange, currentItem.currentTime)) {
        effectiveTimeRange = timeRange;
        *stop = YES;
      }
    }];
    playableDurationMillis = [self _getRoundedMillisFromCMTime:CMTimeRangeGetEnd(effectiveTimeRange)];
    playableDurationMillis = [self _getClippedValueForValue:playableDurationMillis withMin:@(0) withMax:durationMillis];
  }
  
  // Calculate if the player is buffering
  
  BOOL isPlaying = [self _isPlayerPlaying];
  BOOL isBuffering;
  if (isPlaying) {
    isBuffering = NO;
  } else if ([_player respondsToSelector:@selector(timeControlStatus)]) {
    // Only available after iOS 10
    isBuffering = _player.timeControlStatus == AVPlayerTimeControlStatusWaitingToPlayAtSpecifiedRate;
  } else {
    isBuffering = _player.currentItem.isPlaybackBufferEmpty;
  }
  
  // TODO : react-native-video includes the iOS-only keys seekableDuration and canReverse (etc) flags.
  //        Consider adding these.
  return @{EXAVPlayerDataStatusIsLoadedKeyPath: @(YES),
           EXAVPlayerDataStatusURIKeyPath: [_url absoluteString],
           
           EXAVPlayerDataStatusProgressUpdateIntervalMillisKeyPath: _progressUpdateIntervalMillis,
           EXAVPlayerDataStatusDurationMillisKeyPath: durationMillis,
           EXAVPlayerDataStatusPositionMillisKeyPath: positionMillis,
           EXAVPlayerDataStatusPlayableDurationMillisKeyPath: playableDurationMillis,
           
           EXAVPlayerDataStatusShouldPlayKeyPath: @(_shouldPlay),
           EXAVPlayerDataStatusIsPlayingKeyPath: @(isPlaying),
           EXAVPlayerDataStatusIsBufferingKeyPath: @(isBuffering),
           
           EXAVPlayerDataStatusRateKeyPath: _rate,
           EXAVPlayerDataStatusShouldCorrectPitchKeyPath: @(_shouldCorrectPitch),
           EXAVPlayerDataStatusVolumeKeyPath: @(_player.volume),
           EXAVPlayerDataStatusIsMutedKeyPath: @(_player.muted),
           EXAVPlayerDataStatusIsLoopingKeyPath: @(_isLooping),
           
           EXAVPlayerDataStatusDidJustFinishKeyPath: @(NO),};
}

- (void)_callStatusUpdateCallbackWithExtraFields:(NSDictionary *)extraFields
{
  if (_statusUpdateCallback) {
    NSDictionary *status;
    if (extraFields) {
      NSMutableDictionary *mutableStatus = [[self getStatus] mutableCopy];
      [mutableStatus addEntriesFromDictionary:extraFields];
      status = mutableStatus;
    } else {
      status = [self getStatus];
    }
    _statusUpdateCallback(status);
  }
}

- (void)_callStatusUpdateCallback
{
  [self _callStatusUpdateCallbackWithExtraFields:nil];
}

#pragma mark - Observers

- (void)_tryRemoveObserver:(NSObject *)object forKeyPath:(NSString *)path
{
  @try {
    [object removeObserver:self forKeyPath:path];
  } @catch (NSException *exception) {
    // no-op
  }
}

- (void)_removeObservers
{
  NSNotificationCenter *center = [NSNotificationCenter defaultCenter];
  
  [self _tryRemoveObserver:_player forKeyPath:EXAVPlayerDataObserverStatusKeyPath];
  [self _tryRemoveObserver:_player.currentItem forKeyPath:EXAVPlayerDataObserverStatusKeyPath];
  
  if (_finishObserver) {
    [center removeObserver:_finishObserver];
  }
  if (_playbackStalledObserver) {
    [center removeObserver:_playbackStalledObserver];
  }
  
  [self _tryRemoveObserver:_player forKeyPath:EXAVPlayerDataObserverRateKeyPath];
  [self _tryRemoveObserver:_player forKeyPath:EXAVPlayerDataObserverTimeControlStatusPath];
  [self _tryRemoveObserver:_player.currentItem forKeyPath:EXAVPlayerDataObserverPlaybackBufferEmptyKeyPath];
}

- (void)_removeTimeObserver
{
  if (_timeObserver) {
    [_player removeTimeObserver:_timeObserver];
    _timeObserver = nil;
  }
}

- (void)_updateTimeObserver
{
  [self _removeTimeObserver];
  
  __weak __typeof__(self) weakSelf = self;
  
  CMTime interval = CMTimeMakeWithSeconds(_progressUpdateIntervalMillis.floatValue / 1000.0, NSEC_PER_SEC);
  
  void (^timeObserverBlock)(CMTime time) = ^(CMTime time) {
    __strong __typeof__(self) strongSelf = weakSelf;
    
    if (strongSelf && strongSelf.player.status == AVPlayerStatusReadyToPlay) {
      strongSelf.currentPosition = time; // We keep track of _currentPosition to reset the AVPlayer in handleMediaServicesReset.
      [strongSelf _callStatusUpdateCallback];
    }
  };
  
  _timeObserver = [_player addPeriodicTimeObserverForInterval:interval
                                                        queue:NULL
                                                   usingBlock:timeObserverBlock];
}

- (void)_addObserversForNewPlayer
{
  [self _removeObservers];
  [self _updateTimeObserver];
  
  NSNotificationCenter *center = [NSNotificationCenter defaultCenter];
  
  __weak __typeof__(self) weakSelf = self;
  
  void (^didPlayToEndTimeObserverBlock)(NSNotification *note) = ^(NSNotification *note) {
    __strong __typeof__(self) strongSelf = weakSelf;
    
    if (strongSelf) {
      [strongSelf _callStatusUpdateCallbackWithExtraFields:@{EXAVPlayerDataStatusDidJustFinishKeyPath: @(YES)}];
      if (strongSelf.isLooping) {
        [strongSelf.player seekToTime:kCMTimeZero];
        strongSelf.player.rate = strongSelf.rate.floatValue;
      } else {
        [strongSelf.exAV deactivateAudioSessionIfUnused];
      }
    }
  };
  
  _finishObserver = [center addObserverForName:AVPlayerItemDidPlayToEndTimeNotification
                                        object:[_player currentItem]
                                         queue:nil
                                    usingBlock:didPlayToEndTimeObserverBlock];
  
  void (^playbackStalledObserverBlock)(NSNotification *note) = ^(NSNotification *note) {
    [weakSelf _callStatusUpdateCallback];
  };
  
  _playbackStalledObserver = [center addObserverForName:AVPlayerItemPlaybackStalledNotification
                                                 object:[_player currentItem]
                                                  queue:nil
                                             usingBlock:playbackStalledObserverBlock];
  
  [_player addObserver:self forKeyPath:EXAVPlayerDataObserverRateKeyPath options:0 context:nil];
  [_player addObserver:self forKeyPath:EXAVPlayerDataObserverTimeControlStatusPath options:0 context:nil]; // Only available after iOS 10
  [_player.currentItem addObserver:self forKeyPath:EXAVPlayerDataObserverPlaybackBufferEmptyKeyPath options:0 context:nil];
}



- (void)observeValueForKeyPath:(NSString *)keyPath
                      ofObject:(id)object
                        change:(NSDictionary *)change
                       context:(void *)context
{
  if (_player == nil || (object != _player && object != _player.currentItem)) {
    [super observeValueForKeyPath:keyPath ofObject:object change:change context:context];
    return;
  }
  
  if (object == _player) {
    if ([keyPath isEqualToString:EXAVPlayerDataObserverStatusKeyPath]) {
      switch (_player.status) {
        case AVPlayerStatusUnknown:
          break;
        case AVPlayerStatusReadyToPlay:
          if (!_isLoaded && _player.currentItem.status == AVPlayerItemStatusReadyToPlay) {
            [self _finishLoadingNewPlayer];
          }
          break;
        case AVPlayerStatusFailed: {
          _isLoaded = NO;
          NSString *errorMessage = [NSString stringWithFormat:@"The AVPlayer instance has failed with the error code %li and domain \"%@\".", _player.error.code, _player.error.domain];
          if (_loadFinishBlock) {
            _loadFinishBlock(NO, nil, errorMessage);
            _loadFinishBlock = nil;
          } else if (_errorCallback) {
            _errorCallback(errorMessage);
          }
          break;
        }
      }
    } else if ([keyPath isEqualToString:EXAVPlayerDataObserverRateKeyPath]) {
      if (_player.rate != 0) {
        _rate = @(_player.rate);
      }
      [self _callStatusUpdateCallback];
    } else if ([keyPath isEqualToString:EXAVPlayerDataObserverTimeControlStatusPath]
               || [keyPath isEqualToString:EXAVPlayerDataObserverStatusKeyPath]) {
      [self _callStatusUpdateCallback];
    }
  } else if (object == _player.currentItem) {
    if ([keyPath isEqualToString:EXAVPlayerDataObserverStatusKeyPath]) {
      switch (_player.currentItem.status) {
        case AVPlayerItemStatusUnknown:
          break;
        case AVPlayerItemStatusReadyToPlay:
          if (!_isLoaded && _player.status == AVPlayerItemStatusReadyToPlay) {
            [self _finishLoadingNewPlayer];
          }
          break;
        case AVPlayerItemStatusFailed: {
          NSString *errorMessage = [NSString stringWithFormat:@"The AVPlayerItem instance has failed with the error code %li and domain \"%@\".", _player.currentItem.error.code, _player.currentItem.error.domain];
          if (_loadFinishBlock) {
            _loadFinishBlock(NO, nil, errorMessage);
            _loadFinishBlock = nil;
          } else if (_errorCallback) {
            _errorCallback(errorMessage);
          }
          _isLoaded = NO;
          break;
        }
      }
    } else if ([keyPath isEqualToString:EXAVPlayerDataObserverPlaybackBufferEmptyKeyPath]
               || [keyPath isEqualToString:EXAVPlayerDataObserverStatusKeyPath]) {
      [self _callStatusUpdateCallback];
    }
  }
}

#pragma mark - EXAVObject

- (void)pauseImmediately
{
  if (_player) {
    [_player pause];
  }
}

- (BOOL)isUsingAudioSession
{
  return [self _isPlayerPlaying] || _shouldPlay;
}

- (void)bridgeDidForeground:(NSNotification *)notification
{
  if (_shouldPlay) {
    [self _playPlayerWithRate];
  }
}

- (void)bridgeDidBackground:(NSNotification *)notification
{
  // EXAudio already forced pause.
}

- (void)handleAudioSessionInterruption:(NSNotification*)notification
{
  NSNumber *interruptionType = [[notification userInfo] objectForKey:AVAudioSessionInterruptionTypeKey];
  switch (interruptionType.unsignedIntegerValue) {
    case AVAudioSessionInterruptionTypeBegan:
      // System already forced pause.
      [self _callStatusUpdateCallback];
      break;
    case AVAudioSessionInterruptionTypeEnded:
      if (_shouldPlay) {
        [self _playPlayerWithRate];
      }
      [self _callStatusUpdateCallback];
      break;
    default:
      break;
  }
}

- (void)handleMediaServicesReset:(void (^)())finishCallback
{
  // See here: https://developer.apple.com/library/content/qa/qa1749/_index.html
  // (this is an unlikely notification to receive, but best practices suggests that we catch it just in case)
  
  _isLoaded = NO;
  
  // We want to temporarily disable _statusUpdateCallback so that all of the new state changes don't trigger a waterfall of updates:
  void (^callback)(NSDictionary *) = _statusUpdateCallback;
  _statusUpdateCallback = nil;
  __weak __typeof__(self) weakSelf = self;
  
  _loadFinishBlock = ^(BOOL success, NSDictionary *successStatus, NSString *error) {
    if (finishCallback != nil) {
      finishCallback();
    }
    if (_statusUpdateCallback == nil) {
      _statusUpdateCallback = callback;
    }
    [weakSelf _callStatusUpdateCallback];
    if (!success && weakSelf.errorCallback) {
      weakSelf.errorCallback(error);
    }
  };
  
  [self _removeTimeObserver];
  [self _removeObservers];
  
  [self _loadNewPlayer];
}

#pragma mark - NSObject Lifecycle

- (void)dealloc
{
  [self _removeTimeObserver];
  [self _removeObservers];
}

@end
