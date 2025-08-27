'use strict';
module.exports = {
	'avail_lang': { 'en': 'en', 'ar': 'ar' },
	'api': {
		'success': {
			"en": 'Api executed!',
			"ar": 'تم بنجاح'
		},
		'fail': {
			"en": 'Something went wrong!',
			"ar": 'حدث خطأ ما!'
		},
		'error': {
			"en": 'Internal server error',
			"ar": 'خطأ في الخادم المحلي'
		},
		'param_missing': {
			"en": 'Parameter Missing',
			"ar": 'يوجد عنصر مفقود'
		},
	},
	'otp': {
		'required': {
			"en": 'Please enter otp.',
			"ar": 'الرجاء إدخال رمز التحقق'
		},
		'valid': {
			"en": 'Please enter valid otp',
			"ar": 'الرجاء إدخال رمز تحقق صالح'
		},
		'send': {
			"en": 'OTP has been sent sucessfully.',
			"ar": 'تم إرسال رمز التحقق إلى جوالك'
		},
		'fail': {
			"en": 'OTP sending failed.',
			"ar": 'لم نستطع إرسال رمز التحقق إلى جوالك'
		},
		'verified': {
			"en": 'OTP verified succesfully.',
			"ar": 'تم التحقق'
		},
		'incorrect': {
			"en": 'OTP is incorrect.',
			"ar": 'رمز التحقق غير صحيح'
		},
		'mobile_otp': {
			"en": 'OTP has been sent sucessfully.',
			"ar": 'تم إرسال رمز التحقق إلى جوالك'
		},
		'email_otp': {
			"en": 'OTP has been sent to your email',
			"ar": 'تم إرسال رمز التحقق إلى بريدك الإلكتروني'
		}
	},
	'login': {
		'success': {
			"en": 'Login successfull',
			"ar": 'تم تسجيل الدخول بنجاح'
		},
		'invalid': {
			"en": 'You are not registered',
			"ar": 'الرقم غير مسجل لدينا'
		},
		'fail': {
			"en": 'Your password is incorrect',
			"ar": 'البيانات غير صحيحة'
		}
	},
	'auth': {
		'session_expired': {
			'en': 'Session Time Expired, Please \n Login again to continue',
			'ar': 'انتهى وقت الجلسة ، يرجى \ n تسجيل الدخول مرة أخرى للمتابعة'
		},
		'account_pending': {
			'en': 'Your account status is pending, Please verify your account.',
			'ar': 'حالة حسابك معلقة ، يرجى التحقق من حسابك.'
		},
		'account_deleted': {
			'en': 'Your account has been blocked, please contact Admin.',
			'ar': 'تم حظر حسابك ، يرجى الاتصال بالمسؤول.'
		},
		'account_not_found': {
			'en': 'Your account details not found.',
			'ar': 'تفاصيل حسابك غير موجودة.'
		}
	},
	'device': {
		'device_type': {
			"en": 'Please enter device type',
			"ar": 'يرجى إدخال نوع الجهاز'
		},
		'valid_device_type': {
			"en": 'Please enter valid device type',
			"ar": 'يرجى إدخال نوع جهاز الصحيح'
		},
		'device_token': {
			"en": 'Please enter device token',
			"ar": 'يرجى إدخال رمز الجهاز'
		}
	},
	'email': {
		'required': {
			"en": 'Please enter email',
			"ar": 'يرجى إدخال البريد الإلكتروني'

		},
		'valid_email': {
			"en": 'Please enter valid email id.',
			"ar": 'الرجاء إدخال بريد إلكتروني صحيح'
		},
		'not_exists': {
			"en": 'Please enter the registered email id.',
			"ar": 'البريد الإلكتروني غير مسجل لدينا'
		},
		'exists': {
			"en": 'Email already exists',
			"ar": 'البريد الالكتروني موجود سابقاً'
		}
	},
	'mobile': {
		'required': {
			"en": 'Please enter mobile',
			"ar": 'يرجى إدخال رقم الجوال'

		},
		'valid_mobile': {
			"en": 'Please enter valid mobile',
			"ar": 'الرجاء إدخال رقم الجوال الصحيح'
		},
		'between': {
			"en": 'Mobile must be between 8 to 15 digits',
			"ar": 'يجب أن يكون رقم الجوال بين 8 إلى 15 رقمًا'
		},
		'not_exists': {
			"en": 'Please enter the registered mobile number.',
			"ar": 'رقم الجوال غير مسجل لدينا'
		},
		'exists': {
			"en": 'Mobile number already exists',
			"ar": 'رقم الجوال مسجل سابقاً'
		},
		'update': {
			"en": "Mobile number has been updated successfully",
			"ar": "تم تحديث رقم الجوال بنجاح",
		}
	},
	'country_code': {
		"en": 'Please enter country code',
		"ar": 'يرجى إدخال رمز الدولة'
	},
	'facebook': {
		'required': {
			"en": 'Please enter facebook id',
			"ar": 'يرجى إدخال حساب الفيسبوك'
		},
		'not_exists': {
			"en": "Facebook doesn't exist",
			"ar": "حساب الفيسبوك غير موجود"
		}
	},
	'google': {
		'required': {
			"en": 'Please enter google id',
			"ar": 'يرجى إدخال حساب جوجل'
		},
		'not_exists': {
			"en": "Google doesn't exist",
			"ar": "حساب جوجل غير موجود"
		}
	},
	'confirm_password': {
		'required': {
			"en": 'Please enter confirm password',
			"ar": 'يرجى تأكيد كلمة المرور'
		}
	},
	'password': {
		'required': {
			"en": 'Please enter password',
			"ar": 'يرجى إدخال كلمة المرور'
		},
		'between': {
			"en": 'Password must be greater than or equal 6',
			"ar": 'يجب أن تكون كلمة المرور أكثر من 6'
		},
		'correct': {
			"en": 'Please enter correct password',
			"ar": 'كلمة المرور غير صحيحة'
		},
		'wrong': {
			"en": 'Please enter correct old password',
			"ar": 'كلمة المرور القديمة خاطئة'
		},
		'same': {
			"en": 'Password & confirm password must be same',
			"ar": 'كلمة المرور وتأكيدها غير متطابقين'
		},
		'oldNewSimlar': {
			"en": "New Password can not be same as Old Password.",
			"ar": "يجب أن تكون كلمة المرور الجديدة مختلفة عن السابقة"
		},
		'success': {
			"en": 'Password has been changed successfully',
			"ar": 'تم تغيير كلمة المرور بنجاح'
		},
		'set': {
			"en": 'Password has been set successfully',
			"ar": 'تم تعيين كلمة المرور'
		},
	},
	'account': {
		'inactive': {
			"en": 'Your accound is inactive. Please contact to Admin',
			"ar": 'الحساب الخاص بك غير نشط. يرجى الاتصال بالمسؤول'
		},
		'pending': {
			"en": 'Your accound is pending',
			"ar": 'الحساب الخاص بك معلق'
		}
	},
	'first_name': {
		'required': {
			"en": "Please enter first name",
			"ar": 'يرجى إدخال الاسم الأول'
		}
	},
	'last_name': {
		'required': {
			"en": "Please enter last name",
			"ar": 'يرجى إدخال اسم العائلة'
		}
	},
	'agreement': {
		'required': {
			"en": 'Please check agreement',
			"ar": 'يرجى التحقق من الاتفاقية'
		},
		'value': {
			"en": 'Agreement must be 0 Or 1',
			"ar": 'يجب أن تكون الاتفاقية 0 أو 1'
		}
	},
	'user_id': {
		'required': {
			"en": 'Please enter user id',
			"ar": 'يرجى إدخال اسم المستخدم'
		},
		'valid': {
			"en": 'Please enter vaid user id',
			"ar": 'الرجاء إدخال اسم مستخدم صحيح'
		},
		'details': {
			"en": "User details.",
			"ar": 'بيانات المستخدم'
		},
	},
	'token': {
		'valid': {
			"en": 'Invalid token',
			"ar": 'الرمز غير صالح'
		}
	},
	'profile': {
		'update': {
			"en": 'Profile has been updated successfully',
			"ar": 'تم تحديث الملف الشخصي بنجاح'
		}
	},
	'logout': {
		'success': {
			"en": 'Logout successfull',
			"ar": 'تم تسجيل الخروج بنجاح'
		},
		'fail': {
			"en": 'Fail to logout',
			"ar": 'فشل في تسجيل الخروج'
		}
	},
	'user': {
		'updated': {
			"en": 'Profile updated Sucessfully.',
			"ar": 'تم تحديث الملف التعريفي بنجاح'
		},
		'details': {
			"en": 'Profile Details Fetched Sucessfully.',
			"ar": 'تم استرجاع الملف التعريفى بنجاح'
		},
		'not_exists': {
			"en": 'User does not exists.',
			"ar": 'الحساب غير موجود'
		}
	},
	'forgot_password': {
		'email': {
			"en": 'A temporary password has been sent to your registered email address.',
			"ar": 'تم ارسال كلمة المرور المؤقتة إلى بريدك الإلكتروني'
		},
		'mobile': {
			"en": 'A temporary password has been sent to your registered mobile.	',
			"ar": 'تم ارسال كلمة المرور المؤقتة إلى جوالك'
		}
	},
	'home': {
		'category_list': {
			"en": 'Category List fetched successfully.',
			"ar": 'تم استرجاع قائمة التصنيف بنجاح'
		},
		'brand_list': {
			"en": 'Brand List fetched successfully.',
			"ar": 'تم استرجاع قائمة العلامات التجارية بنجاح'
		},
		'banner_list': {
			"en": 'Banner List fetched successfully.',
			"ar": 'تم استرجاع القائمة بنجاح'
		},
		'product_list': {
			"en": 'Products List fetched successfully.',
			"ar": 'تم استرجاع قائمة المنتجات بنجاح'
		}
	},
	'product': {
		'list': {
			"en": 'Product list fetched sucessfully.',
			"ar": 'تم استرجاع قائمة المنتجات بنجاح'
		},
		'list_extensively': {
			"en": 'Can not list extensively used listings',
			"ar": 'لا يمكن سرد القوائم المستخدمة على نطاق واسع'
		},
		'added': {
			"en": 'Product added successfully.',
			"ar": 'تم إضافة المنتج بنجاح'
		},
		'delete': {
			"en": 'Product deleted successfully.',
			"ar": 'تم إزالة منتجك بنجاح'
		},
		'favourite': {
			"en": 'Product added to favourites.',
			"ar": 'تمت الإضافة إلى المفضلة'
		},
		'self_favourite': {
			"en": 'Users can not like their product',
			"ar": 'لا يمكنك الاعجاب بالمنتجات الخاصه بك'
		},
		'unfavourite': {
			"en": 'Product removed from favourites.',
			"ar": 'تم إزالة التفضيل بنجاح'
		},
		'product_list': {
			"en": 'Product list fetched sucessfully.',
			"ar": 'تم استرجاع قائمة المنتجات بنجاح'
		},
		'fav_list': {
			"en": 'Favourite product list fetched sucessfully.',
			"ar": 'تم استرجاع قائمة المنتجات المفضلة بنجاح'
		},
		'add_wishlist_exist': {
			"en": 'Product already present in wishlist.',
			"ar": 'المنتج موجود مسبقاً في قائمة الرغبات'
		},
		'review_product': {
			"en": 'Product review submitted successfully.',
			"ar": 'تم ارسال تقييم المنتج بنجاح'
		},
		'product_detail': {
			"en": 'Product details fetched successfully.',
			"ar": 'تم استرجاع تفاصيل المنتج بنجاح'
		},
		'similar_product': {
			"en": 'Similar Products fetched successfully.',
			"ar": 'تم استرجاع المنتجات المشابهة بنجاح'
		},
		'not_exists': {
			"en": 'Product does not exists.',
			"ar": 'لم يتم العثور على المنتج'
		},
		'not_available': {
			"en": 'Product not available.',
			"ar": 'المنتج غير متوفر'
		},
		'not_delete': {
			"en": 'Someone is trying to bid or buy this product.',
			"ar": 'هناك شخص يحاول سوم أو شراء المنتج'
		},
		'renew': {
			"en": 'Product renewed succesfully.',
			"ar": 'تم تجديد المنتج بنجاح'
		},
		'renewERR': {
			"en": 'Product already not expired.',
			"ar": 'المنتج ما زال متاحا'
		},
		'renewAll':{
			"en": 'Products renewed succesfully.',
			"ar": 'تم تجديد المنتجات بنجاح'
		},
		renewAllEmpty:{
			"en": 'All products not expired yet.',
			"ar": 'جميع المنتجات مازالت متاحه '
		},
		"change_status": {
			"en": 'Product status changed succesfully.',
			"ar": 'تم تغير حاله المنتج بنجاح'
		},
		"above_sell_price": {
			"en": "Product sell price should be less than new product price",
			"ar": 'سعر البيع يجب ان يكون اقل من سعر المنتج الجديد'
		},
		'invalide_listing_interval': {
			"en": "Listing product interval is 10 s",
			"ar": 'يجب عليك انتظار 10 ثوان قبل اضافه منتج جديد'
		},
		"zero_sell_price" : {
			"en": "Sell price must be greater than zero",
			"ar": 'سعر البيع يجب ان يكون اكبر من الصفر'
		},
		"missing_security_fee" : {
			"en": "Security fee is not submitted",
			"ar": "لم يتم تقديم مصاريف الحماية"
		},
		'sold': {
			"en": 'Product was sold before.',
			"ar": 'قام مشترى اخر بشراء المنتج'
		},
		'refund' : {
			"en": 'Product was refunded before.',
			"ar": 'منتج مرتجع لايمكن شراءه'
		},
		'locked': {
			"en": 'Product is locked for an other payment.',
			"ar": 'المنتج معلق لعمليه شراء اخرى'
		},
	},
	'bid': {
		'success': {
			"en": 'Transaction save and bid submitted successfully.',
			"ar": 'تم حفط العملية وإرسال السومة بنجاح'
		},
		'accept': {
			"en": 'Bid accepted succesfully.',
			"ar": 'تم قبول السومة'
		},
		'remove': {
			"en": 'Bid removed successfully.',
			"ar": 'تم إزالة السومة بنجاح'
		},
		'reject': {
			"en": 'The seller rejected your _BIDVALUE_ bid.',
			"ar": 'تم رفض السومة _BIDVALUE_'
		},
		'not_exists': {
			"en": 'Bid does not exists.',
			"ar": 'السومة غير موجودة'
		},
		'highest': {
			"en": 'Your _BIDVALUE_ bid is the highest.',
			"ar": 'سومتك _BIDVALUE_ هي الأعلى'
		},
		'lower': {
			"en": 'Your bid _BIDVALUE_ is no longer highest.',
			"ar": 'سومتك _BIDVALUE_ لم تعد الأعلى'
		},
		'accepted': {
			"en": 'Your _BIDVALUE_ bid has been accepted.',
			"ar": 'تم قبول سومتك _BIDVALUE_'
		},
		'greater': {
			"en": 'Someone has placed a higher or equal bid to yours, please bid again with a higher value.',
			"ar": 'شخصٌ ما سام بنفس السعر قبل قليل'
		},
		'self_bid': {
			"en": 'You are the seller , you can not bid on your product',
			"ar": ' أنت بائع هذا المنتج ,لا يمكنك السوم على المنتجات الخاصة بك.'
		},
		'above_sell': {
			"en": "Total bid price can't be equal or more than the sell price.",
			"ar": 'لا يمكن لسومتك ان تكون مساويه او اكبر من سعر البيع'
		}
	},
	'address': {
		'list': {
			"en": 'Address list fetched successfully',
			"ar": 'تم استرجاع العنوان بنجاح'
		},
		'added': {
			"en": 'Address Added successfully.',
			"ar": 'تم إضافة العنوان بنجاح'
		},
		'updated': {
			"en": 'Address Updated Successfully.',
			"ar": 'تم تحديث العنوان بنجاح'
		},
		'deleted': {
			"en": 'Address deleted.',
			"ar": 'تم إزالة العنوان بنجاح'
		},
		'default': {
			"en": 'Deafult address updated.',
			"ar": 'تم تحديث العنوان الرئيسي بنجاح'
		},
		'view': {
			"en": 'Address List fetched Successfully.',
			"ar": 'تم استرجاع قائمة العناوين بنجاح'
		},
		'not_exists': {
			"en": 'Address not found',
			"ar": 'يرجى إدخال العنوان قبل اكمال العملية'
		},
		'pick_up_not_exists': {
			"en": 'Pickup address not found',
			"ar": 'لم يتم العثور على عنوان الاستلام'
		},
	},
	'checkout': {
		'success': {
			"en": 'Proceed successfully',
			"ar": 'تم الاتمام بنجاح'
		},
		'fail': {
			"en": 'Error in proceeding, try again',
			"ar": 'خطأ في إتمام العملية، حاول مرة أخرى'
		},
		'minimum_value_fail': {
			"en": 'Minimum value less than price.',
			"ar": 'فشل في تسجيل الخروج'
		},
		'already_used': {
			"en": 'This promocode is valid for one time use only.',
			"ar": 'الرمز المستخدم صالح لمرة واحدة فقط'
		},
		'self_buy': {
			"en": 'Cannot buy your own product',
			"ar": 'لا يمكنك شراء المتجات الخاصه بك'
		}
	},
	'question': {
		'added': {
			"en": 'Question submitted successfully',
			"ar": 'تم إرسال السؤال بنجاح'
		},
		'answer': {
			"en": 'Answer submitted successfully',
			"ar": 'تم إرسال الجواب بنجاح'
		},
		'not_exists': {
			"en": 'Question not found.',
			"ar": 'لم يتم العثور على السؤال'
		},
		'delete': {
			"en": 'Question was deleted successfully.',
			"ar": 'تم إزاله السؤال بنجاح'
		},
		'self_ask': {
			"en": 'Cannot ask on own product',
			"ar": 'لا يمكنك السؤال على المتجات الخاصه بك'
		}
	},
	'order': {
		'success': {
			"en": 'Transaction save and order sent successfully.',
			"ar": 'تم حفط العملية وإرسال الطلب بنجاح'
		},
		'invalid': {
			"en": 'Inavlid promo code.',
			"ar": 'الرمز غير صالح'
		},
		'order_list': {
			"en": 'Order list fetched sucessfully.',
			"ar": 'تم استرجاع قائمة الطلبات بنجاح'
		},
		'order_list_fail': {
			"en": 'Order list was not fetched sucessfully.',
			"ar": 'لم يتم استرجاع قائمة الطلبات بنجاح'
		},
		'detail': {
			"en": 'Order detail fetched sucessfully.',
			"ar": 'تم استرجاع تفاصيل الطلب بنجاح'
		},
		'order_cancelled': {
			"en": 'Order has been cancelled sucessfully.',
			"ar": 'تم إلغاء الطلب بنجاح'
		},
		'cancel_order_disallow': {
			"en": 'Your order cannot be cancelled.',
			"ar": 'لا يمكن إلغاء طلبك'
		},
		'not_exists': {
			"en": 'Order does not exists.',
			"ar": 'الطلب غير موجود'
		},
		'financing_request_not_approved': {
			"en": 'Financing Request is not approved.',
			"ar": 'لم تتم الموافقة على طلب التمويل'
		},
		'delivered': {
			"en": 'Order has been delivered.',
			"ar": 'تم تسليم الطلب بنجاح.'
		},
		'payment_pending': {
			"en": 'Payment is pending, please wait.',
			"ar": 'الدفع معلق ، يرجى الانتظار'
		},
		'payment_failed': {
			"en": 'Payment failed, try again.',
			"ar": 'لم تتم عملية الدفع بنجاح، يرجى المحاولة مرة أخرى'
		},
		'transaction_cancel': {
			"en": 'Transaction cancelled successfully.',
			"ar": 'تم إلغاء العملية بنجاح'
		},
		'ship_detail': {
			"en": 'Shipping detail fetched successfully.',
			"ar": 'تم استرجاع معلومات التوصيل بنجاح'
		},
		'track_detail': {
			"en": 'Track detail fetched successfully.',
			"ar": 'تم استرجاع معلومات التوصيل بنجاح'
		},
		'query': {
			"en": 'Your query submitted succesfully.',
			"ar": 'تم إرسال طلبك بنجاح'
		}
	},
	'contact_queries': {
		'submitted': {
			"en": 'Contact query submitted Successfully.',
			"ar": 'تم إرسال طلب التواصل بنجاح'
		}
	},
	'notification': {
		'list': {
			"en": 'Notification list fetched Successfully.',
			"ar": 'تم استرجاع قائمة الاشعارات بنجاح'
		},
		'clear': {
			"en": 'Notification list cleared Successfully.',
			"ar": 'تم مسح قائمة الاشعارات بنجاح'
		},
	},
	'notification_setting': {
		'notification_on': {
			"en": 'Push Notifications turned ON',
			"ar": 'تم تفعيل الاشعارات'
		},
		'notification_off': {
			"en": 'Push Notifications turned OFF.',
			"ar": 'تم إيقاف الاشعارات'
		}

	},
	'category': {
		'added': {
			"en": 'Category added successfully.',
			"ar": 'تم إضافة التصنيف بنجاح'
		},
		'updated': {
			"en": 'Category updated successfully.',
			"ar": 'تم تحديث التصنيف بنجاح'
		},
		'deleted': {
			"en": 'Category deleted successfully.',
			"ar": 'تم إزالة التصنيف بنجاح'
		},
		'list': {
			"en": 'Category list fetched sucessfully.',
			"ar": 'تم استرجاع قائمة التصنيف بنجاح'
		},
		'detail': {
			"en": 'Category detail fetched sucessfully.',
			"ar": 'تم استرجاع تفاصيل التصنيف بنجاح'
		},
		'exists': {
			"en": 'Category name already exists.',
			"ar": 'اسم التصنيف موجود بالفعل'
		},
	},
	'brand': {
		'added': {
			"en": 'Brand added successfully.',
			"ar": 'تم إضافة العلامة التجارية بنجاح'
		},
		'updated': {
			"en": 'Brand updated successfully.',
			"ar": 'تم تحديث العلامة التجارية بنجاح'
		},
		'deleted': {
			"en": 'Brand deleted successfully.',
			"ar": 'تم إزالة العلامة التجارية بنجاح'
		},
		'list': {
			"en": 'Brand list fetched sucessfully.',
			"ar": 'تم استرجاع قائمة العلامات التجارية بنجاح'
		},
		'detail': {
			"en": 'Brand detail fetched sucessfully.',
			"ar": 'تم استرجاع معلومات العلامة التجارية بنجاح'
		},
		'exists': {
			"en": 'Brand name already exists.',
			"ar": 'اسم العلامة التجارية موجود بالفعل '
		},
	},
	'model': {
		'added': {
			"en": 'Model added successfully.',
			"ar": 'تم إضافة الطراز بنجاح'
		},
		'updated': {
			"en": 'Model updated successfully.',
			"ar": 'تم تحديث الطراز '
		},
		'deleted': {
			"en": 'Model deleted successfully.',
			"ar": 'تم إزالة الطراز'
		},
		'list': {
			"en": 'Model list fetched sucessfully.',
			"ar": 'تم استرجاع قائمة الطراز بنجاح'
		},
		'detail': {
			"en": 'Model detail fetched sucessfully.',
			"ar": 'تم استرجاع معلومات الطراز بنجاح'
		},
		'exists': {
			"en": 'Model name already exists.',
			"ar": 'اسم الطراز موجود بالفعل'
		},
		'missingParameters': {
			"en": "Required parameters are missing.",
			"ar": 'بعض المعطيات غير مكتمله'
		},
		'modelUpdate': {
			'en': "Model updated successfully.",
			'ar': 'تم تحديت الطراز بنجاح'
		},
		'notFound': {
			'en': "Data not found.",
			'ar': 'لم يتم العثور على الطراز'
		}
	},
	'bank': {
		'added': {
			"en": 'Bank added successfully.',
			"ar": 'تم تسجيل البنك بنجاح'
		},
		'updated': {
			"en": 'Bank updated successfully.',
			"ar": 'تم تحديث تفاصيل البنك بنجاح'
		},
		'deleted': {
			"en": 'Bank deleted successfully.',
			"ar": 'تم حذف البنك بنجاح.'
		},
		'list': {
			"en": 'Bank list fetched sucessfully.',
			"ar": 'تم استرجاع قائمة البنوك بنجاح'
		},
		'detail': {
			"en": 'Bank detail fetched sucessfully.',
			"ar": 'تم إضافة معلومات البنك بنجاح'
		},
		'exists': {
			"en": 'Bank name already exists.',
			"ar": 'اسم البنك موجود مسبقاً'
		},
		'invalidConditionId': {
			"en": "Preset condition should be in UUID format",
			"ar": 'رقم تعريفى غير صحيح لحاله الجهاز'
    },
		'invalid': {
			"en": 'Invalid IBAN.',
			"ar": 'رقم الحساب المصرفي الدولي غير صالح.'
		},
		'missingStoreDetail': {
			"en": 'VAT Registered Name and Store Vat Number cannot be empty when has Vat Registered Store is true.',
			"ar": 'لا يمكن أن يكون الاسم المسجل لضريبة القيمة المضافة ورقم ضريبة القيمة المضافة فارغًا عندما يكون المتجر المسجل لضريبة القيمة المضافة صحيحًا.'
		}
	},
	'setting': {
		'added': {
			"en": 'Setting added successfully.',
			"ar": 'تم إضافة الإعدادات بنجاح'
		},
		'updated': {
			"en": 'Setting updated successfully.',
			"ar": 'تم تحديث الإعدادات بنجاح'
		},
		'deleted': {
			"en": 'Setting deleted successfully.',
			"ar": 'تم حذف الإعدادات بنجاح'
		},
		'list': {
			"en": 'Setting list fetched sucessfully.',
			"ar": 'تم استرجاع قائمة الإعدادات بنجاح'
		},
		'detail': {
			"en": 'Setting detail fetched sucessfully.',
			"ar": 'تم استرجاع الإعدادات بنجاح'
		}

	},
	'variant': {
		'added': {
			"en": 'Variant added successfully.',
			"ar": 'تم إضافة النوع بنجاح'
		},
		'updated': {
			"en": 'Variant updated successfully.',
			"ar": 'تم تحديث النوع بنجاح'
		},
		'deleted': {
			"en": 'Variant deleted successfully.',
			"ar": 'تم إزالة النوع بنجاح'
		},
		'list': {
			"en": 'Variant list fetched successfully.',
			"ar": 'تم استرجاع قائمة النوع بنجاح'
		},
		'detail': {
			"en": 'Variant detail fetched sucessfully.',
			"ar": 'تم استرجاع قائمة النوع بنجاح'
		},
		'exists': {
			"en": 'Variant already exists.',
			"ar": 'اسم النوع موجود بالفعل '
		},
	},
	'language': {
		'updated': {
			"en": 'Language updated successfully.',
			"ar": 'تم تحديث اللغه بنجاح'
		},
	},
	'UserAction': {
		'list': {
			"en": 'User action list fetched sucessfully.',
			"ar": 'تم استرجاع قائمة الافعال بنجاح'
		},
	},
	'payout': {
		'success': {
			"en": 'Payout action was sucessfully executed.',
			"ar": 'تم اتمام العمليه بنجاح'
		},
		'fail': {
			"en": 'Payout action was failed',
			"ar": 'حدث خطأ ما'
		},
		'tokenFail': {
			"en": 'Payout login token fails',
			"ar": 'حدث خطأ ما'
		},
	},
	'promocode': {
		'added': {
			"en": 'Promo was generated successfully.',
			"ar": 'تم إضافة كود الخصم بنجاح'
		},
		'invalid_param': {
			"en": 'Invalid or missing promo parameters.',
			"ar": 'بعض البيانات غير صحيحه'
		},
		'dublicated': {
			"en": 'Promocode with same code exist before.',
			"ar": 'كود الخصم مكرر'
		},
		'duplicatedDefault': {
			"en": 'Default promocode exist before.',
			"ar": 'كود الخصم الافتراضى موجود من قبل'
		},
		'detail': {
			"en": 'promo detail fetched sucessfully.',
			"ar": 'تم استرجاع معلومات كود الخصم بنجاح'
		},
		'invalid': {
			"en": 'Sorry! could not find this promo code.',
			"ar": 'عذرا، لم اعثر على هذا الكوبون.'
		},
		'invalidUse':{
			"en": 'Sorry! could not use your own promo code.',
			"ar": 'عذرا، لا يمكن استخدام الكوبون الخاص بك'
		},
		'usedBefore' : {
			"en": 'This promo code has been used before.',
			"ar": 'كود الخصم مستخدم من قبل'
		},
		'promoLimitFail':{
			'en': 'This promo can only be applied to higher priced products',
			'ar':'يُطبق الخصم على منتجات بقيمة أعلى'
		},
		'change_status': {
			"en": 'Promo status was changed',
			"ar": 'تم تغير حاله كود الخصم'
		},
		"promo_update_sucess": {
			"en": "Promo Updated Successfully",
			"ar": "تم تعديل الكود بنجاح"
		},
		"promo_error_update": {
			"en": "Error In Updating PromoCode",
			"ar": 'حدث خطأ ما!'
		},
		"fail_update_promo": {
			"en": "Fail In Updating PromoCode",
			"ar": "فشل تعديل الكود"
		},
		"promo_delete": {
			"en": "Promo Delete Successfully!",
			"ar": "تم حذف الكود بنجاح"
		},
		"error_promo_delete": {
			"en": "Error In Deleting Promo",
			"ar": "حدث خطا اثناء حذف الكود"
		}
	}
}