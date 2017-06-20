// Copyright 2015-present 650 Industries. All rights reserved.

#import "EXErrorRecoveryManager.h"
#import "EXKernel.h"

// if the app crashes and it has not yet been 5 seconds since it loaded, don't auto refresh.
#define EX_AUTO_REFRESH_BUFFER_BASE_SECONDS 5.0

NSNotificationName const kEXErrorRecoverySetPropsNotification = @"EXErrorRecoverySetPropsNotification";

@interface EXErrorRecoveryRecord : NSObject

@property (nonatomic, assign) BOOL isRecovering;
@property (nonatomic, strong) NSError *error;
@property (nonatomic, strong) NSDate *dtmLastLoaded;
@property (nonatomic, strong) NSDictionary *developerInfo;

@end

@implementation EXErrorRecoveryRecord

@end

@interface EXErrorRecoveryManager ()

@property (nonatomic, strong) NSMutableDictionary<NSString *, EXErrorRecoveryRecord *> *experienceInfo;
@property (nonatomic, assign) NSUInteger reloadBufferDepth;
@property (nonatomic, strong) NSDate *dtmAnyExperienceLoaded;

@end

@implementation EXErrorRecoveryManager

- (instancetype)init
{
  if (self = [super init]) {
    _reloadBufferDepth = 0;
    _dtmAnyExperienceLoaded = [NSDate date];
    _experienceInfo = [NSMutableDictionary dictionary];
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(_handleRecoveryPropsNotification:)
                                                 name:kEXErrorRecoverySetPropsNotification
                                               object:nil];
  }
  return self;
}

- (void)dealloc
{
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)setDeveloperInfo:(NSDictionary *)developerInfo forExperienceid:(NSString *)experienceId
{
  if (!experienceId) {
    NSAssert(experienceId, @"Cannot associate recovery info with a nil experience id");
  }
  EXErrorRecoveryRecord *record = [self _recordForExperienceId:experienceId];
  if (!record) {
    record = [[EXErrorRecoveryRecord alloc] init];
    _experienceInfo[experienceId] = record;
  }
  record.developerInfo = developerInfo;
}

- (NSDictionary *)developerInfoForExperienceId:(NSString *)experienceId
{
  EXErrorRecoveryRecord *record = [self _recordForExperienceId:experienceId];
  if (record) {
    return record.developerInfo;
  }
  return nil;
}

- (void)setError:(NSError *)error forExperienceId:(NSString *)experienceId
{
  if (!experienceId) {
    NSString *kernelSuggestion = ([EXKernel isDevKernel]) ? @"Make sure you are serving the kernel." : @"";
    NSAssert(experienceId, @"Cannot associate an error with a nil experience id. %@", kernelSuggestion);
  }
  EXErrorRecoveryRecord *record = [self _recordForExperienceId:experienceId];
  if (error) {
    if (!record) {
      record = [[EXErrorRecoveryRecord alloc] init];
      _experienceInfo[experienceId] = record;
    }
    // mark this experience id as having loading problems, so future attempts will bust the cache.
    // this flag never gets unset until the record is removed, even if the error is nullified.
    record.isRecovering = YES;
  }
  if (record) {
    record.error = error;
  }
}

- (BOOL)errorBelongsToExperience:(NSError *)error
{
  if (!error) {
    return NO;
  }
  for (NSString *experienceId in _experienceInfo.allKeys) {
    EXErrorRecoveryRecord *record = [self _recordForExperienceId:experienceId];
    if ([record.error isEqual:error]) {
      return YES;
    }
  }
  return NO;
}

- (void)experienceRestartedWithId:(NSString *)experienceId
{
  [_experienceInfo removeObjectForKey:experienceId];
}

- (void)experienceFinishedLoadingWithId:(NSString *)experienceId
{
  EXErrorRecoveryRecord *record = [self _recordForExperienceId:experienceId];
  if (!record) {
    record = [[EXErrorRecoveryRecord alloc] init];
    _experienceInfo[experienceId] = record;
  }
  record.dtmLastLoaded = [NSDate date];

  // maintain a global record of when anything last loaded, used to calculate autoreload backoff.
  _dtmAnyExperienceLoaded = [NSDate date];
}

- (BOOL)experienceIdIsRecoveringFromError:(NSString *)experienceId
{
  EXErrorRecoveryRecord *record = [self _recordForExperienceId:experienceId];
  if (record) {
    return record.isRecovering;
  }
  return NO;
}

- (BOOL)experienceIdShouldReloadOnError:(NSString *)experienceId
{
  EXErrorRecoveryRecord *record = [self _recordForExperienceId:experienceId];
  if (record) {
    return ([record.dtmLastLoaded timeIntervalSinceNow] < -[self reloadBufferSeconds]);
  }
  // if we have no knowledge of this experience, sure, try reloading right away.
  return YES;
}

- (void)increaseAutoReloadBuffer
{
  _reloadBufferDepth++;
}

#pragma mark - internal

- (EXErrorRecoveryRecord *)_recordForExperienceId: (NSString *)experienceId;
{
  if (experienceId) {
    return _experienceInfo[experienceId];
  }
  return nil;
}

- (void)_handleRecoveryPropsNotification:(NSNotification *)notif
{
  NSDictionary *params = notif.userInfo;
  [self setDeveloperInfo:params[@"props"] forExperienceid:params[@"experienceId"]];
}

- (NSTimeInterval)reloadBufferSeconds
{
  NSTimeInterval interval = MIN(60.0 * 5.0, EX_AUTO_REFRESH_BUFFER_BASE_SECONDS * pow(1.5, _reloadBufferDepth));

  // if nothing has loaded for twice our current backoff interval, reset backoff
  if ([_dtmAnyExperienceLoaded timeIntervalSinceNow] < -(interval * 2.0)) {
    _reloadBufferDepth = 0;
    interval = EX_AUTO_REFRESH_BUFFER_BASE_SECONDS;
  }
  return interval;
}

@end
