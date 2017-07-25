//
//  CalendarManager.m
//  CampID
//
//  Created by Karoly Vig on 6/24/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "Payment.h"
#import "AppDelegate.h"
#import <React/RCTLog.h>

#import "BNCreditCardRegistrationVC.h"
#import "BNBaseTextField.h"
#import "BNCreditCardNumberTextField.h"
#import "BNCreditCardExpiryTextField.h"
#import "UIView+BNUtils.h"
#import "UIColor+BNColors.h"
#import "UITextField+BNCreditCard.h"
#import "BNLoaderButton.h"


@implementation Payment

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(getCreditCardCount:(RCTResponseSenderBlock)callback)
{
    NSArray *authorizedCards = [[BNPaymentHandler sharedInstance] authorizedCards];
    NSString *count = [NSString stringWithFormat:@"%li", authorizedCards.count];
    callback(@[count]);
}

RCT_EXPORT_METHOD(goToRegisterCardView:(RCTResponseSenderBlock)callback)
{
    BNCreditCardRegistrationVC *vc = [BNCreditCardRegistrationVC new];
    vc.completionBlock = ^(BNCCRegCompletion completion, BNAuthorizedCreditCard *card){
        [vc dismissViewControllerAnimated:true completion: nil];
        [self displaAliasAlertWithAuthorizedCard:card callback: callback];
    };
    
    AppDelegate *delegate = (AppDelegate*) [UIApplication sharedApplication].delegate;
    [delegate.window.rootViewController presentViewController:vc animated:NO completion:nil];
}

RCT_EXPORT_METHOD(makePayment:(int)amount currency:(NSString *)currency callback: (RCTResponseSenderBlock)callback)
{
    NSArray *authorizedCards = [[BNPaymentHandler sharedInstance] authorizedCards];
    if (authorizedCards.count == 1) {
        BNPaymentParams *params = [BNPaymentParams mockObject];
        params.token = [[authorizedCards objectAtIndex:0] creditCardToken];
        params.amount = [NSNumber numberWithInt:amount];
        params.currency = currency;
        
        [[BNPaymentHandler sharedInstance] makePaymentWithParams:params
                                                          result:^(BNPaymentResult result, NSError *error) {
                                                              BOOL success = result == BNPaymentSuccess;
                                                              NSString *title = success ? @"Success" : @"Failure";
                                                              NSString *message = success ?
                                                              [NSString stringWithFormat:@"The payment succeeded."]:
                                                              [NSString stringWithFormat:@"The payment did not succeed."];
                                                              
                                                              UIAlertAction* confirmAction = [UIAlertAction actionWithTitle:@"Ok"
                                                                                                                      style:UIAlertActionStyleDefault
                                                                                                                    handler:nil];
                                                              
                                                              [self displayAlertControllerWithStyle:UIAlertControllerStyleAlert
                                                                                              title:title
                                                                                            message:message
                                                                                             action:@[confirmAction]];
                                                              if (success) {
                                                                  callback(@[@"paid"]);
                                                              } else {
                                                                  callback(@[@"unpaid"]);
                                                              }
                                                          }];
        return;
    }

    NSMutableArray *actions = [[NSMutableArray alloc] initWithCapacity:authorizedCards.count+1];
    
    [authorizedCards enumerateObjectsUsingBlock:^(id  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
        __weak BNAuthorizedCreditCard *cc = obj;
        NSString *actionTitle = cc.creditCardAlias ? cc.creditCardAlias : cc.creditCardNumber;
        
        UIAlertAction *action = [UIAlertAction actionWithTitle:actionTitle
                                                         style:UIAlertActionStyleDefault
                                                       handler:^(UIAlertAction * _Nonnull action) {
                                                           
                                                           
                                                           BNPaymentParams *params = [BNPaymentParams mockObject];
                                                           params.token = cc.creditCardToken;
                                                           
                                                           [[BNPaymentHandler sharedInstance] makePaymentWithParams:params
                                                                 result:^(BNPaymentResult result, NSError *error) {
                                                                     BOOL success = result == BNPaymentSuccess;
                                                                     NSString *title = success ? @"Success" : @"Failure";
                                                                     NSString *message = success ?
                                                                     [NSString stringWithFormat:@"The payment succeeded."]:
                                                                     [NSString stringWithFormat:@"The payment did not succeed."];
                                                                     
                                                                     UIAlertAction* confirmAction = [UIAlertAction actionWithTitle:@"Ok"
                                                                                                                             style:UIAlertActionStyleDefault
                                                                                                                           handler:nil];
                                                                     
                                                                     [self displayAlertControllerWithStyle:UIAlertControllerStyleAlert
                                                                                                     title:title
                                                                                                   message:message
                                                                                                    action:@[confirmAction]];
                                                                     if (success) {
                                                                         callback(@[@"paid"]);
                                                                     } else {
                                                                         callback(@[@"unpaid"]);
                                                                     }
                                                                 }];
                                                           
                                                       }];
        [actions addObject:action];
        
    }];
    
    UIAlertAction *cancelAction = [UIAlertAction actionWithTitle:@"Ok" style:UIAlertActionStyleCancel
                                                         handler:nil];
    [actions addObject:cancelAction];
    
    [self displayAlertControllerWithStyle:UIAlertControllerStyleActionSheet
                                    title:@"Choose credit card"
                                  message:nil
                                   action:actions];
}

RCT_EXPORT_METHOD(addCreditCard:(NSString *)cardNumber expMonth:(NSString *)expMonth expYear:(NSString *)expYear cvv:(NSString *)cvv callback:(RCTResponseSenderBlock)callback)
{
    NSArray *authorizedCards = [[BNPaymentHandler sharedInstance] authorizedCards];
    if (authorizedCards.count > 0) {
        callback(@[@"true"]);
    } else {
        callback(@[@"false"]);
    }
    //    BNCreditCard *creditCard = [BNCreditCard new];
//    creditCard.cardNumber = [self.cardNumberTextField.text stringByReplacingOccurrencesOfString:@" " withString:@""];
//    creditCard.expMonth = [self.cardExpiryTextField getExpiryMonth];
//    creditCard.expYear = [self.cardExpiryTextField getExpiryYear];
//    creditCard.cvv = self.cardCVCTextField.text;
//    
//    BNRegisterCCParams *params = [[BNRegisterCCParams alloc] initWithCreditCard:creditCard];
//    
//    [self.submitButton setLoading:YES];
//    
//    [[BNPaymentHandler sharedInstance] registerCreditCard:params completion:^(BNAuthorizedCreditCard *card, NSError *error) {
//        if(self.completionBlock && card) {
//            self.completionBlock(BNCCRegCompletionDone, card);
//        }
//        else {
//            NSString *title = NSLocalizedString(@"Card registration failed", nil);
//            NSString *message = NSLocalizedString(@"Please try again", nil);
//            [self showAlertViewWithTitle:title message:message];
//        }
//        [self.submitButton setLoading:NO];
//    }];
}

- (void)displaAliasAlertWithAuthorizedCard:(BNAuthorizedCreditCard *) __weak card callback:(RCTResponseSenderBlock)callback {
    NSString *title = card ? @"Name" : @"No card";
    NSString *message = card ? @"Please name the credit card." : @"No credit card was registered!";
    
    UIAlertController* alertController = [UIAlertController alertControllerWithTitle:title
                                                                             message:message
                                                                      preferredStyle:UIAlertControllerStyleAlert];
    
    UIAlertAction *action = [UIAlertAction actionWithTitle:@"Ok" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
        if(card) {
            UITextField *aliasTextField = alertController.textFields.firstObject;
            card.creditCardAlias = aliasTextField.text.length > 0 ? aliasTextField.text : card.creditCardNumber;
            [[BNPaymentHandler sharedInstance] saveAuthorizedCreditCard:card];
            callback(@[@"success"]);
        }
    }];
    
    if (card) {
        [alertController addTextFieldWithConfigurationHandler:^(UITextField * _Nonnull textField) {
            textField.placeholder = @"Name";
        }];
    }
    
    [alertController addAction:action];
    
    dispatch_async(dispatch_get_main_queue(), ^(){
        [[UIApplication sharedApplication].delegate.window.rootViewController presentViewController:alertController animated:YES completion:nil];
    });
}

- (void)makePaymentWithCard:(BNAuthorizedCreditCard *)card {
    
}

- (void)displayAlertControllerWithStyle:(UIAlertControllerStyle)style
                                  title:(NSString *)title
                                message:(NSString *)message
                                 action:(NSArray *)actions {
    
    UIAlertController* alert = [UIAlertController alertControllerWithTitle:title
                                                                   message:message
                                                            preferredStyle:style];
    
    for (UIAlertAction *action in actions) {
        [alert addAction:action];
    }
    
    dispatch_async(dispatch_get_main_queue(), ^(){
//        [self presentViewController:alert animated:YES completion:nil];
        [[UIApplication sharedApplication].delegate.window.rootViewController presentViewController:alert animated:YES completion:nil];
    });
}

RCT_EXPORT_METHOD(unregisterCreditCard:(RCTResponseSenderBlock)callback)
{
    NSArray *authorizedCards = [[BNPaymentHandler sharedInstance] authorizedCards];
    
    if (authorizedCards.count > 0) {
        
        NSMutableArray *actions = [[NSMutableArray alloc] initWithCapacity:authorizedCards.count+1];
        
        
        [authorizedCards enumerateObjectsUsingBlock:^(id  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
            __weak BNAuthorizedCreditCard *cc = obj;
            NSString *actionTitle = cc.creditCardAlias ? cc.creditCardAlias : cc.creditCardNumber;
            
            UIAlertAction *action = [UIAlertAction actionWithTitle:actionTitle
                                                             style:UIAlertActionStyleDefault
                                                           handler:^(UIAlertAction * _Nonnull action) {
                                                               [[BNPaymentHandler sharedInstance] removeAuthorizedCreditCard:cc];
                                                               callback(@[@"success"]);
                                                           }];
            [actions addObject:action];
        }];
        
        UIAlertAction *cancelAction = [UIAlertAction actionWithTitle:@"Cancel" style:UIAlertActionStyleCancel
                                                             handler:nil];
        [actions addObject:cancelAction];
        
        [self displayAlertControllerWithStyle:UIAlertControllerStyleActionSheet
                                        title:@"Choose credit card"
                                      message:nil
                                       action:actions];
        
    } else {
        callback(@[@"success"]);
        UIAlertAction* confirmAction = [UIAlertAction actionWithTitle:@"OK" style:UIAlertActionStyleDefault
                                                              handler:nil];
        [self displayAlertControllerWithStyle:UIAlertControllerStyleAlert
                                        title:@"No credit card registered"
                                      message:@"There is nothing to remove."
                                       action:@[confirmAction]];
    }
}

@end
