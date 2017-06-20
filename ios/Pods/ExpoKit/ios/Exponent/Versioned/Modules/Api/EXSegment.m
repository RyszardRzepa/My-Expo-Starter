// Copyright 2015-present 650 Industries. All rights reserved.

#import "EXSegment.h"

#import <SEGAnalytics.h>

@interface EXSegment ()

@property (nonatomic, strong) SEGAnalytics *instance;

@end

@implementation EXSegment

RCT_EXPORT_MODULE(ExponentSegment);

RCT_EXPORT_METHOD(initializeIOS:(NSString *)writeKey)
{
  SEGAnalyticsConfiguration *configuration = [SEGAnalyticsConfiguration configurationWithWriteKey:writeKey];
  _instance = [[SEGAnalytics alloc] initWithConfiguration:configuration];
}

RCT_EXPORT_METHOD(initializeAndroid:(NSString *)writeKey)
{
  // NO-OP. Need this here because Segment has different keys for iOS and Android.
}

RCT_EXPORT_METHOD(identify:(NSString *)userId)
{
  if (_instance) {
    [_instance identify:userId];
  }
}


RCT_EXPORT_METHOD(identifyWithTraits:(NSString *)userId withTraits:(NSDictionary *)traits)
{
  if (_instance) {
    [_instance identify:userId traits:traits];
  }
}

RCT_EXPORT_METHOD(track:(NSString *)event)
{
  if (_instance) {
    [_instance track:event];
  }
}

RCT_EXPORT_METHOD(trackWithProperties:(NSString *)event withProperties:(NSDictionary *)properties)
{
  if (_instance) {
    [_instance track:event properties:properties];
  }
}

RCT_EXPORT_METHOD(flush)
{
  if (_instance) {
    [_instance flush];
  }
}

@end
