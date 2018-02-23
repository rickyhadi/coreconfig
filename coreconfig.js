function coreconfig (){
	var rootdir = env.rootdir || __dirname;
	var appConfig = require('appconfig');
	var staticConfig = require('staticconfig');
	var versionConfig = require('versionconfig');
	var languageConfig = require('languageconfig');
	var helper = require('helper')();
	
	var obj = {};
	obj.getCoreConfig = async function(section, req) {
		var StaticConfigCommon = staticConfig.COMMON;
		var StaticConfigTemplate = staticConfig.TEMPLATE;
		var StaticConfigSection = staticConfig[section];
		
		var Hostname = req.hostname;
		var DomainPrefix = Hostname.split('.')[0];
		var Domain = Hostname.replace(DomainPrefix + '.', '');
		var VirtualPath = req.path;
		var IsLogin = helper.isLogin(req);
		var Status = IsLogin ? '_after': '';
		var Theme = StaticConfigCommon.Theme;
		var LocCountryCode = 'ID'; //needchange : getcountry
		var CDNDomain = appConfig.App.CDNDomain.Domain;
		if(appConfig.App.CDNDomain['Domain'+LocCountryCode]){
			CDNDomain = appConfig.App.CDNDomain['Domain'+LocCountryCode];
		}
		if(CDNDomain){
			var CDNTheme = StaticConfigCommon.CDNTheme;
			Theme = CDNTheme;
		}
		var Lang = 'en-US';//needchange : getlanguage
		var LangFiles = languageConfig['_langFiles'][Lang.toLowerCase()];
		var BasePath = rootdir;
		var Browser =  helper.getClientBrowser(req);
		var CurrentDate = new Date();
		var Year = CurrentDate.getFullYear();

		var cc = {
			'StaticMediasPath' : StaticConfigSection.StaticMediasPath,
			'StaticImgPath' : StaticConfigSection.StaticImgPath,
			'StaticCssPath' : StaticConfigSection.StaticCssPath,
			'StaticPath' : StaticConfigSection.StaticPath,
			'StaticSrc' : StaticConfigSection.StaticSrc,
			'TemplateSrc' : StaticConfigTemplate.TemplateSrc,
			'MediasPath' : StaticConfigCommon.MediasPath,
			'ImgPath' : StaticConfigCommon.ImgPath,
			'CssPath' : StaticConfigCommon.CssPath,
			'CommonPath' : StaticConfigCommon.CommonPath,
			'CommonSrc' : StaticConfigCommon.CommonSrc,
			'DomainPrefix': DomainPrefix,
			'Domain': Domain,
			'Status': Status,
			'CDNDomain': CDNDomain,
			'Theme': Theme,
			'LocCountryCode' : LocCountryCode,
			'VJS': versionConfig.VJS,
			'VCSS': versionConfig.VCSS,
			'VIMG': versionConfig.VIMG,
			'Lang': Lang,
			'LangLower' : Lang.toLowerCase(),
			'LangFiles': LangFiles,
			'VirtualPath': VirtualPath,
			'BasePath' : BasePath,
			'Browser' : Browser,
			'Year' : Year
		}

		if(IsLogin){
			var MemberObjectString = await helper.getMemberObject(req);
			if(MemberObjectString){
				var MemberObject = JSON.parse(MemberObjectString);
				cc['MemberCode'] = MemberObject.user;
			}
		}
		return cc;
	};
	return obj;
}

module.exports = coreconfig;
