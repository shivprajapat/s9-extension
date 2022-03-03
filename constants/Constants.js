// Class to provide all the static texts used in the application
export class Constants {
	static selectedRecordId="";
	static selectedTab=1;
	static saveRecordNotification=0;
	static callAllRecords=0;
	static userDetails=0;
	static when403Error=0;
	static noRecordFoundMsg = "There are no matching records in SplashID";
	static notUserLoginMsg = "Not Logged in SplashID";
	static SplashID='SplashID';
	static TrialEnded ="Trial has ended";
	static TrialMsg ="Your free trial of SplashID has ended. To regain immediate access, you need to subscribe to SplashID.";
	static SubscribeBtnText="Subscribe for $19.99 / year";
	static SplashDataCurrentYear = Constants.getCurrentYear();
	static signinText = 'Login from web app by clicking on the button below.';
	static signIn = 'Sign In';
	static noRecordInFolder = 'There are no matching records available for';
	static Cancel = "Cancel";
	static defaultTypeId = '0000000000000012';
	static defaultImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
	static isNewRecord = 0;
	static DisableAutoCaptureText ="Disable Auto-Capture Web Logins";
	static syncTypeTwoMsg ="You are a WiFi sync user. This extension cannot access your records.";
	static syncTypeThreeMsg ="You are a No sync user. This extension cannot access your records.";
	static syncTypeMsg ="Your sync method is not known. Please contact SplashID support for assistance.";
	static poweredBy = "Powered by";
	static All = "All";
	static Fav = "Fav";
	static Version = "Version";
	static dateModified = "Date Modified";
	static fieldValueUnderScore = "_____";
	static notesLable = "NOTES";
	static Login = "Login";
	static recordNotFound = "No records Found";
	static syncAccess= "Sync Access";
	static Later= "Later";
	static Save= "Save";
	static dontShowDialogMsg= "Don't show this dialog again";
	static loginFor= "Logins for";
	static searchRecord = "Search records...";
		
	static getCurrentYear(){
		return '© 2001- '+(new Date).getFullYear()+' SplashData, Inc';
	}
}