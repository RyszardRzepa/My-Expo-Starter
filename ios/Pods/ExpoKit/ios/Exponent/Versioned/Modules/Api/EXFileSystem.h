// Copyright 2016-present 650 Industries. All rights reserved.

#import <React/RCTBridgeModule.h>

@interface EXFileSystem : NSObject <RCTBridgeModule>

+ (BOOL)ensureDirExistsWithPath:(NSString *)path;

@end
