var enjoyhint_instance = new EnjoyHint({
	onSkip:function(){
		sessionStorage.setItem('onTour', false);
	}
});

var tours = {
	homePage: [
		{
			'click #userDropdown' : 'To Sighup select the User Management dropdown'
		},
		{
			'click #userAccount' : 'Now select the User Account tab'
		}
	],
	signinPage: [
		{
			'click #signup' : 'Now click Signup to make a new account'
		}
	],
	signupPage: [
		{
			'onChange #username': 'Enter in a Username,'
		},
		{
			'onChange #password': 'and a Password'
		},
		{
			'click #signupButton': 'Now submit the request'
		}
	],
	userProfilePage: [
		{
			'click #recordBooks': 'To make a new Record Book click this tab'
		}
	],
	recordBooksPage: [
		{
			'onChange #nameInput': 'Create a name for your Record Book'
		},
		{
			'onChange #typeInput': 'Select a type for your Record Book'
		},
		{
			'onChange #yearInput': 'Select a year for your Record Book'
		},
		{
			'click #submit': 'Now submit the request to make your Record Book and you Done!',
			onBeforeStart:function(){
      			sessionStorage.setItem('onTour', false);
    		}
		}
	]
}