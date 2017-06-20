#import "EXUtil.h"
#import "EXUnversioned.h"
#import <React/RCTUIManager.h>
#import <React/RCTBridge.h>
#import <React/RCTUtils.h>

@implementation EXUtil

RCT_EXPORT_MODULE(ExponentUtil);

@synthesize bridge = _bridge;

- (dispatch_queue_t)methodQueue
{
  return self.bridge.uiManager.methodQueue;
}

RCT_EXPORT_METHOD(reload)
{
  [[NSNotificationCenter defaultCenter] postNotificationName:EX_UNVERSIONED(@"EXKernelRefreshForegroundTaskNotification")
                                                      object:nil
                                                    userInfo:@{
                                                               @"bridge": self.bridge
                                                               }];
}

RCT_REMAP_METHOD(getCurrentLocaleAsync,
                 getCurrentLocaleWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  NSArray<NSString *> *preferredLanguages = [NSLocale preferredLanguages];
  if (preferredLanguages.count > 0) {
    resolve(preferredLanguages[0]);
  } else {
    NSString *errMsg = @"This device does not indicate its locale";
    reject(@"E_NO_PREFERRED_LOCALE", errMsg, RCTErrorWithMessage(errMsg));
  }
}

@end
