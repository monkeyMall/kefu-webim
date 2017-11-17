!function(t){function n(a){if(e[a])return e[a].exports;var s=e[a]={exports:{},id:a,loaded:!1};return t[a].call(s.exports,s,s.exports,n),s.loaded=!0,s.exports}var e={};return n.m=t,n.c=e,n.p="",n(0)}([function(module,exports,__webpack_require__){eval("__webpack_require__(1);\nmodule.exports = __webpack_require__(4);\n\n\n/*****************\n ** WEBPACK FOOTER\n ** multi main\n ** module id = 0\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///multi_main?")},function(module,exports,__webpack_require__){eval('var emajax = __webpack_require__(2);\nvar Transfer = __webpack_require__(3);\n// 此文件用于跨域请求api，故为了兼容老版本，接口不能删\n// 新增接口一律写在后边，按照时间顺序\n// 主要入口的url上附加tenantId，用于限流\n// post 请求时，所有msg.data参数都会被序列化为request body，如果需要去除参数需要使用 delete\n\n\n// 此处由于要兼容老版本，所以在实例化对象时不能指定 useObject = true，而是依据 options.msg.useObject 来判断\nvar getData = new Transfer(null, "api");\n\nfunction emitAjax(options){\n\tvar headers = null;\n\tvar msg = options.msg;\n\tvar data = msg.data;\n\tvar useObject = msg.useObject;\n\tvar api = msg.api;\n\tvar timestamp = msg.timespan;\n\n\tif(data && data.headers){\n\t\theaders = data.headers;\n\t\tdelete data.headers;\n\t}\n\n\temajax({\n\t\turl: options.url,\n\t\theaders: headers,\n\t\tdata: options.excludeData ? null : data,\n\t\ttype: options.type,\n\t\tisFileUpload: options.isFileUpload,\n\t\tsuccess: function(resp, xhr){\n\t\t\ttry{\n\t\t\t\tresp = JSON.parse(resp);\n\t\t\t}\n\t\t\tcatch(e){}\n\t\t\tgetData.send({\n\t\t\t\tcall: api,\n\t\t\t\ttimespan: timestamp,\n\t\t\t\tstatus: 0,\n\t\t\t\tdata: resp,\n\t\t\t\tstatusCode: xhr.status,\n\t\t\t\tuseObject: useObject\n\t\t\t});\n\t\t},\n\t\terror: function(resp, xhr){\n\t\t\ttry{\n\t\t\t\tresp = JSON.parse(resp);\n\t\t\t}\n\t\t\tcatch(e){}\n\t\t\tgetData.send({\n\t\t\t\tcall: api,\n\t\t\t\ttimespan: timestamp,\n\t\t\t\tstatus: 1,\n\t\t\t\tdata: resp,\n\t\t\t\tstatusCode: xhr.status,\n\t\t\t\tuseObject: useObject\n\t\t\t});\n\t\t}\n\t});\n}\n\ngetData.listen(function(msg){\n\tvar apiName = msg.api;\n\tvar params = msg.data || {};\n\tvar tenantId = params.tenantId;\n\tvar techChannelInfo = params.orgName\n\t\t+ "%23" + params.appName\n\t\t+ "%23" + params.imServiceNumber;\n\tvar url;\n\n\tgetData.targetOrigin = msg.origin;\n\n\tswitch(apiName){\n\tcase "getRelevanceList":\n\t\temitAjax({\n\t\t\turl: "/v1/webimplugin/targetChannels",\n\t\t\ttype: "GET",\n\t\t\tmsg: msg\n\t\t});\n\t\tbreak;\n\tcase "getDutyStatus":\n\t// DEPRECATED!!!\n\t\temitAjax({\n\t\t\turl: "/v1/webimplugin/showMessage",\n\t\t\ttype: "GET",\n\t\t\tmsg: msg\n\t\t});\n\t\tbreak;\n\tcase "getWechatVisitor":\n\t\temitAjax({\n\t\t\turl: "/v1/webimplugin/visitors/wechat/" + params.openid\n\t\t\t\t+ "?tenantId=" + tenantId,\n\t\t\tmsg: msg,\n\t\t\ttype: "POST"\n\t\t});\n\t\tbreak;\n\tcase "createVisitor":\n\t\temitAjax({\n\t\t\turl: "/v1/webimplugin/visitors?tenantId=" + tenantId,\n\t\t\tmsg: msg,\n\t\t\ttype: "POST"\n\t\t});\n\t\tbreak;\n\tcase "getSession":\n\t// DEPRECATED!!!\n\t\temitAjax({\n\t\t\turl: "/v1/webimplugin/visitors/" + params.id\n\t\t\t\t+ "/schedule-data?techChannelInfo=" + techChannelInfo\n\t\t\t\t+ "&tenantId=" + tenantId,\n\t\t\tmsg: msg,\n\t\t\ttype: "GET",\n\t\t\texcludeData: true\n\t\t});\n\t\tbreak;\n\tcase "getExSession":\n\t// DEPRECATED!!!\n\t\temitAjax({\n\t\t\turl: "/v1/webimplugin/visitors/" + params.id\n\t\t\t\t+ "/schedule-data-ex?techChannelInfo=" + techChannelInfo\n\t\t\t\t+ "&tenantId=" + tenantId,\n\t\t\tmsg: msg,\n\t\t\ttype: "GET",\n\t\t\texcludeData: true\n\t\t});\n\t\tbreak;\n\tcase "getPassword":\n\t\temitAjax({\n\t\t\turl: "/v1/webimplugin/visitors/password",\n\t\t\ttype: "GET",\n\t\t\tmsg: msg\n\t\t});\n\t\tbreak;\n\tcase "getGroup":\n\t// DEPRECATED!!!\n\t\temitAjax({\n\t\t\turl: "/v1/webimplugin/visitors/" + params.id\n\t\t\t\t+ "/ChatGroupId?techChannelInfo=" + techChannelInfo\n\t\t\t\t+ "&tenantId=" + tenantId,\n\t\t\tmsg: msg,\n\t\t\ttype: "GET",\n\t\t\texcludeData: true\n\t\t});\n\t\tbreak;\n\tcase "getGroupNew":\n\t// DEPRECATED!!!\n\t\temitAjax({\n\t\t\turl: "/v1/webimplugin/tenant/" + tenantId\n\t\t\t\t+ "/visitors/" + params.id +\n\t\t\t\t"/ChatGroupId?techChannelInfo=" + techChannelInfo\n\t\t\t\t+ "&tenantId=" + tenantId,\n\t\t\tmsg: msg,\n\t\t\ttype: "GET",\n\t\t\texcludeData: true\n\t\t});\n\t\tbreak;\n\tcase "getHistory":\n\t// DEPRECATED!!!\n\t\temitAjax({\n\t\t\turl: "/v1/webimplugin/visitors/msgHistory",\n\t\t\ttype: "GET",\n\t\t\tmsg: msg\n\t\t});\n\t\tbreak;\n\tcase "getSlogan":\n\t\temitAjax({\n\t\t\turl: "/v1/webimplugin/notice/options",\n\t\t\ttype: "GET",\n\t\t\tmsg: msg\n\t\t});\n\t\tbreak;\n\tcase "getTheme":\n\t\temitAjax({\n\t\t\turl: "/v1/webimplugin/theme/options",\n\t\t\ttype: "GET",\n\t\t\tmsg: msg\n\t\t});\n\t\tbreak;\n\tcase "getSystemGreeting":\n\t\temitAjax({\n\t\t\turl: "/v1/webimplugin/welcome",\n\t\t\ttype: "GET",\n\t\t\tmsg: msg\n\t\t});\n\t\tbreak;\n\tcase "getRobertGreeting":\n\t// DEPRECATED!!!\n\t\temitAjax({\n\t\t\turl: "/v1/Tenants/"\n\t\t\t\t+ tenantId\n\t\t\t\t+ "/robots/visitor/greetings/"\n\t\t\t\t+ params.originType\n\t\t\t\t+ "?tenantId=" + tenantId,\n\t\t\tmsg: msg,\n\t\t\ttype: "GET",\n\t\t\texcludeData: true\n\t\t});\n\t\tbreak;\n\tcase "sendVisitorInfo":\n\t// DEPRECATED!!!\n\t\temitAjax({\n\t\t\turl: "/v1/webimplugin/tenants/" + tenantId\n\t\t\t\t+ "/visitors/" + params.visitorId +\n\t\t\t\t"/attributes?tenantId=" + tenantId,\n\t\t\tmsg: msg,\n\t\t\ttype: "POST"\n\t\t});\n\t\tbreak;\n\tcase "getProject":\n\t\temitAjax({\n\t\t\turl: "/tenants/" + tenantId + "/projects",\n\t\t\ttype: "GET",\n\t\t\tmsg: msg\n\t\t});\n\t\tbreak;\n\tcase "createTicket":\n\t\temitAjax({\n\t\t\turl: "/tenants/" + tenantId\n\t\t\t\t+ "/projects/" + params.projectId\n\t\t\t\t+ "/tickets?tenantId=" + tenantId\n\t\t\t\t+ "&easemob-target-username=" + params["easemob-target-username"]\n\t\t\t\t+ "&easemob-appkey=" + params["easemob-appkey"]\n\t\t\t\t+ "&easemob-username=" + params["easemob-username"],\n\t\t\tmsg: msg,\n\t\t\ttype: "POST"\n\t\t});\n\t\tbreak;\n\tcase "getNoteCategories":\n\t\temitAjax({\n\t\t\turl: "/tenants/" + tenantId\n\t\t\t\t+ "/projects/" + params.projectId\n\t\t\t\t+ "/categories?tenantId=" + tenantId\n\t\t\t\t+ "&easemob-target-username=" + params["easemob-target-username"]\n\t\t\t\t+ "&easemob-appkey=" + params["easemob-appkey"]\n\t\t\t\t+ "&easemob-username=" + params["easemob-username"],\n\t\t\tmsg: msg,\n\t\t\ttype: "GET",\n\t\t\texcludeData: true\n\t\t});\n\t\tbreak;\n\tcase "receiveMsgChannel":\n\t\temitAjax({\n\t\t\turl: "/v1/imgateway/messages",\n\t\t\ttype: "GET",\n\t\t\tmsg: msg\n\t\t});\n\t\tbreak;\n\tcase "sendMsgChannel":\n\t\temitAjax({\n\t\t\turl: "/v1/imgateway/messages?tenantId=" + tenantId,\n\t\t\tmsg: msg,\n\t\t\ttype: "POST"\n\t\t});\n\t\tbreak;\n\tcase "getAgentStatus":\n\t\t// 没有token时不发送请求\n\t\tif(!params.token){\n\t\t\tconsole.error("token does not exist.");\n\t\t\treturn;\n\t\t}\n\t\temitAjax({\n\t\t\turl: "/v1/tenants/" + tenantId\n\t\t\t\t+ "/agents/" + params.agentUserId + "/agentstate",\n\t\t\ttype: "GET",\n\t\t\tmsg: msg\n\t\t});\n\t\tbreak;\n\tcase "getNickNameOption":\n\t\temitAjax({\n\t\t\turl: "/v1/webimplugin/agentnicename/options?tenantId=" + tenantId,\n\t\t\tmsg: msg,\n\t\t\ttype: "GET",\n\t\t\texcludeData: true\n\t\t});\n\t\tbreak;\n\t\t// 此接口使用的是单独的微服务，无需限流\n\tcase "reportEvent":\n\t\temitAjax({\n\t\t\turl: "/v1/event_collector/events",\n\t\t\tmsg: msg,\n\t\t\ttype: "POST"\n\t\t});\n\t\tbreak;\n\tcase "deleteEvent":\n\t\temitAjax({\n\t\t\turl: "/v1/event_collector/event/" + encodeURIComponent(params.userId),\n\t\t\tmsg: msg,\n\t\t\ttype: "DELETE",\n\t\t\texcludeData: true\n\t\t});\n\t\tbreak;\n\tcase "mediaStreamUpdateStatus":\n\t\turl = "/v1/rtcmedia/media_streams/" + params.streamId;\n\t\tdelete params.streamId;\n\n\t\temitAjax({\n\t\t\turl: url,\n\t\t\tmsg: msg,\n\t\t\ttype: "PUT"\n\t\t});\n\t\tbreak;\n\tcase "graylist":\n\t// DEPRECATED!!!\n\t\temitAjax({\n\t\t\turl: "/management/graylist",\n\t\t\tmsg: msg,\n\t\t\ttype: "GET",\n\t\t\texcludeData: true\n\t\t});\n\t\tbreak;\n\tcase "getCurrentServiceSession":\n\t\temitAjax({\n\t\t\turl: "/v1/webimplugin/tenant/"\n\t\t\t\t+ tenantId\n\t\t\t\t+ "/visitors/"\n\t\t\t\t+ params.id\n\t\t\t\t+ "/CurrentServiceSession?techChannelInfo=" + techChannelInfo\n\t\t\t\t+ "&tenantId="\n\t\t\t\t+ tenantId,\n\t\t\tmsg: msg,\n\t\t\ttype: "GET",\n\t\t\texcludeData: true\n\t\t});\n\t\tbreak;\n\tcase "messagePredict":\n\t// DEPRECATED!!!\n\t\turl = "/v1/webimplugin/agents/" + params.agentId\n\t\t\t+ "/messagePredict"\n\t\t\t+ "?tenantId=" + params.tenantId;\n\n\t\t// fake: 避免多余的参数传递到 post body 中\n\t\tdelete params.tenantId;\n\t\tdelete params.agentId;\n\n\t\temitAjax({\n\t\t\turl: url,\n\t\t\tmsg: msg,\n\t\t\ttype: "POST"\n\t\t});\n\t\tbreak;\n\tcase "getSessionQueueId":\n\t// DEPRECATED!!!\n\t\turl = "/v1/visitors/" + params.visitorUsername + "/waitings/sessions";\n\n\t\tdelete params.visitorUsername;\n\n\t\temitAjax({\n\t\t\turl: url,\n\t\t\tmsg: msg,\n\t\t\ttype: "GET"\n\t\t});\n\t\tbreak;\n\tcase "getWaitListNumber":\n\t\temitAjax({\n\t\t\turl: "/v1/visitors/waitings/data",\n\t\t\tmsg: msg,\n\t\t\ttype: "GET"\n\t\t});\n\t\tbreak;\n\tcase "getDutyStatus_2":\n\t\temitAjax({\n\t\t\turl: "/v1/webimplugin/tenants/show-message",\n\t\t\ttype: "GET",\n\t\t\tmsg: msg\n\t\t});\n\t\tbreak;\n\tcase "getRobertGreeting_2":\n\t\temitAjax({\n\t\t\turl: "/v1/webimplugin/tenants/robots/welcome",\n\t\t\ttype: "GET",\n\t\t\tmsg: msg\n\t\t});\n\t\tbreak;\n\tcase "getSkillgroupMenu":\n\t\temitAjax({\n\t\t\turl: "/v1/webimplugin/tenants/" + tenantId + "/skillgroup-menu",\n\t\t\ttype: "GET",\n\t\t\tmsg: msg,\n\t\t\texcludeData: true\n\t\t});\n\t\tbreak;\n\tcase "getAgentInputState":\n\t\temitAjax({\n\t\t\turl: "/v1/webimplugin/sessions/" + params.serviceSessionId\n\t\t\t+ "/agent-input-state?tenantId=" + tenantId\n\t\t\t+ "&orgName=" + params.orgName + "&appName=" + params.appName\n\t\t\t+ "&userName=" + params.username + "&token=" + params.token,\n\t\t\tmsg: msg,\n\t\t\ttype: "GET",\n\t\t\texcludeData: true\n\t\t});\n\t\tbreak;\n\tcase "closeServiceSession":\n\t\turl = "/webimplugin/tenants/" + tenantId\n\t\t\t+ "/visitors/" + params.userName\n\t\t\t+ "/servicesessions/" + params.serviceSessionId\n\t\t\t+ "/stop?tenantId=" + tenantId;\n\t\tdelete params.serviceSessionId;\n\t\temitAjax({\n\t\t\turl: url,\n\t\t\tmsg: msg,\n\t\t\ttype: "POST"\n\t\t});\n\t\tbreak;\n\tcase "uploadImgMsgChannel":\n\t\temitAjax({\n\t\t\turl: "/v1/Tenant/" + tenantId\n\t\t\t\t+ "/" + params.orgName + "/" + params.appName\n\t\t\t\t+ "/" + params.userName + "/MediaFiles",\n\t\t\tmsg: msg,\n\t\t\tisFileUpload: true,\n\t\t\ttype: "POST"\n\t\t});\n\t\tbreak;\n\tcase "getVisitorInfo":\n\t\temitAjax({\n\t\t\turl: "/v1/webimplugin/tenants/" + tenantId\n\t\t\t\t+ "/visitors?orgName=" + params.orgName\n\t\t\t\t+ "&appName=" + params.appName\n\t\t\t\t+ "&userName=" + params.userName\n\t\t\t\t+ "&token=" + params.token\n\t\t\t\t+ "&techChannelInfo=" + techChannelInfo,\n\t\t\tmsg: msg,\n\t\t\ttype: "GET",\n\t\t\texcludeData: true\n\t\t});\n\t\tbreak;\n\tcase "getOfficalAccounts":\n\t\temitAjax({\n\t\t\turl: "/v1/webimplugin/tenants/" + tenantId\n\t\t\t\t+ "/visitors/" + params.visitorId\n\t\t\t\t+ "/official-accounts?page=0&size=100"\n\t\t\t\t+ "&orgName=" + params.orgName\n\t\t\t\t+ "&appName=" + params.appName\n\t\t\t\t+ "&userName=" + params.userName\n\t\t\t\t+ "&token=" + params.token,\n\t\t\tmsg: msg,\n\t\t\ttype: "GET",\n\t\t\texcludeData: true\n\t\t});\n\t\tbreak;\n\tcase "getOfficalAccountMessage":\n\t\temitAjax({\n\t\t\turl: "/v1/webimplugin/tenants/" + tenantId\n\t\t\t\t+ "/visitors/" + params.visitorId\n\t\t\t\t+ "/official-accounts/" + params.officialAccountId\n\t\t\t\t+ "/messages"\n\t\t\t\t+ "?size=" + params.size\n\t\t\t\t// 当startId为空时不传\n\t\t\t\t+ (params.startId ? "&startId=" + params.startId : "")\n\t\t\t\t+ "&direction=" + params.direction\n\t\t\t\t+ "&orgName=" + params.orgName\n\t\t\t\t+ "&appName=" + params.appName\n\t\t\t\t+ "&userName=" + params.userName\n\t\t\t\t+ "&token=" + params.token,\n\t\t\tmsg: msg,\n\t\t\ttype: "GET",\n\t\t\texcludeData: true\n\t\t});\n\t\tbreak;\n\tcase "getConfig":\n\t\temitAjax({\n\t\t\turl: "/v1/webimplugin/settings/visitors/configs/" + params.configId,\n\t\t\tmsg: msg,\n\t\t\ttype: "GET",\n\t\t\texcludeData: true\n\t\t});\n\t\tbreak;\n\t// 会话创建前 获取该会话  是否将于机器人进行\n\tcase "getRobertIsOpen":\n\t\temitAjax({\n\t\t\turl: "/v1/webimplugin/tenants/robot-ready",\n\t\t\ttype: "GET",\n\t\t\tmsg: msg\n\t\t});\n\t\tbreak;\n\tcase "getExSession_2":\n\t\temitAjax({\n\t\t\turl: "/v1/webimplugin/visitors/" + params.username\n\t\t\t\t+ "/schedule-data-ex2"\n\t\t\t\t+ "?techChannelInfo=" + techChannelInfo\n\t\t\t\t+ "&channelType=" + params.channelType\n\t\t\t\t+ "&originType=" + params.originType\n\t\t\t\t+ "&channelId=" + params.channelId\n\t\t\t\t+ "&queueName=" + params.queueName\n\t\t\t\t+ "&agentUsername=" + params.agentUsername\n\t\t\t\t+ "&tenantId=" + tenantId,\n\t\t\tmsg: msg,\n\t\t\ttype: "GET",\n\t\t\texcludeData: true\n\t\t});\n\t\tbreak;\n\tcase "getLastSession":\n\t\temitAjax({\n\t\t\turl: "/v1/webimplugin/tenants/" + tenantId\n\t\t\t\t+ "/visitors/" + params.visitorId\n\t\t\t\t+ "/official-accounts/" + params.officialAccountId\n\t\t\t\t+ "/latest-session"\n\t\t\t\t+ "?orgName=" + params.orgName\n\t\t\t\t+ "&appName=" + params.appName\n\t\t\t\t+ "&userName=" + params.userName\n\t\t\t\t+ "&token=" + params.token\n\t\t\t\t+ "&techChannelInfo=" + techChannelInfo,\n\t\t\tmsg: msg,\n\t\t\ttype: "GET",\n\t\t\texcludeData: true\n\t\t});\n\t\tbreak;\n\tcase "reportVisitorAttributes":\n\t\turl = "/v1/webimplugin/tenants/" + tenantId\n\t\t\t+ "/sessions/" + params.sessionId\n\t\t\t+ "/attributes"\n\t\t\t+ "?orgName=" + params.orgName\n\t\t\t+ "&appName=" + params.appName\n\t\t\t+ "&userName=" + params.userName\n\t\t\t+ "&token=" + params.token\n\t\t\t+ "&techChannelInfo=" + techChannelInfo;\n\n\t\tdelete params.tenantId;\n\t\tdelete params.sessionId;\n\n\t\tdelete params.orgName;\n\t\tdelete params.appName;\n\t\tdelete params.userName;\n\t\tdelete params.token;\n\t\tdelete params.imServiceNumber;\n\n\t\temitAjax({\n\t\t\turl: url,\n\t\t\tmsg: msg,\n\t\t\ttype: "POST"\n\t\t});\n\t\tbreak;\n\tcase "messagePredict_2":\n\t\turl = "/v1/webimplugin/servicesessions/" + params.sessionId\n\t\t\t+ "/messagePredict"\n\t\t\t+ "?orgName=" + params.orgName\n\t\t\t+ "&appName=" + params.appName\n\t\t\t+ "&userName=" + params.userName\n\t\t\t+ "&token=" + params.token\n\t\t\t+ "&techChannelInfo=" + techChannelInfo;\n\n\t\tdelete params.sessionId;\n\n\t\tdelete params.orgName;\n\t\tdelete params.appName;\n\t\tdelete params.userName;\n\t\tdelete params.token;\n\t\tdelete params.imServiceNumber;\n\n\t\temitAjax({\n\t\t\turl: url,\n\t\t\tmsg: msg,\n\t\t\ttype: "POST"\n\t\t});\n\t\tbreak;\n\tcase "reportMarketingTaskDelivered":\n\t\turl = "/v1/webimplugin/tenants/" + tenantId\n\t\t\t+ "/marketing-tasks/" + params.marketingTaskId\n\t\t\t+ "/delivered"\n\t\t\t+ "?orgName=" + params.orgName\n\t\t\t+ "&appName=" + params.appName\n\t\t\t+ "&userName=" + params.userName\n\t\t\t+ "&token=" + params.token;\n\n\t\tdelete params.tenantId;\n\t\tdelete params.marketingTaskId;\n\n\t\tdelete params.orgName;\n\t\tdelete params.appName;\n\t\tdelete params.userName;\n\t\tdelete params.token;\n\n\t\temitAjax({\n\t\t\turl: url,\n\t\t\tmsg: msg,\n\t\t\ttype: "PUT"\n\t\t});\n\t\tbreak;\n\tcase "reportMarketingTaskOpened":\n\t\turl = "/v1/webimplugin/tenants/" + tenantId\n\t\t\t+ "/marketing-tasks/" + params.marketingTaskId\n\t\t\t+ "/opened"\n\t\t\t+ "?orgName=" + params.orgName\n\t\t\t+ "&appName=" + params.appName\n\t\t\t+ "&userName=" + params.userName\n\t\t\t+ "&token=" + params.token;\n\n\t\tdelete params.tenantId;\n\t\tdelete params.marketingTaskId;\n\n\t\tdelete params.orgName;\n\t\tdelete params.appName;\n\t\tdelete params.userName;\n\t\tdelete params.token;\n\n\t\temitAjax({\n\t\t\turl: url,\n\t\t\tmsg: msg,\n\t\t\ttype: "PUT"\n\t\t});\n\t\tbreak;\n\tcase "reportMarketingTaskReplied":\n\t\turl = "/v1/webimplugin/tenants/" + tenantId\n\t\t\t+ "/marketing-tasks/" + params.marketingTaskId\n\t\t\t+ "/replied"\n\t\t\t+ "?orgName=" + params.orgName\n\t\t\t+ "&appName=" + params.appName\n\t\t\t+ "&userName=" + params.userName\n\t\t\t+ "&token=" + params.token;\n\n\t\tdelete params.tenantId;\n\t\tdelete params.marketingTaskId;\n\n\t\tdelete params.orgName;\n\t\tdelete params.appName;\n\t\tdelete params.userName;\n\t\tdelete params.token;\n\n\t\temitAjax({\n\t\t\turl: url,\n\t\t\tmsg: msg,\n\t\t\ttype: "PUT"\n\t\t});\n\t\tbreak;\n\tcase "getLatestMarketingTask":\n\t\temitAjax({\n\t\t\turl: "/v1/webimplugin/tenants/" + tenantId\n\t\t\t\t+ "/official-accounts/" + params.officialAccountId\n\t\t\t\t+ "/marketing-tasks"\n\t\t\t\t+ "?orgName=" + params.orgName\n\t\t\t\t+ "&appName=" + params.appName\n\t\t\t\t+ "&userName=" + params.userName\n\t\t\t\t+ "&token=" + params.token,\n\t\t\tmsg: msg,\n\t\t\ttype: "GET",\n\t\t\texcludeData: true\n\t\t});\n\t\tbreak;\n\tcase "getEvaluationDegrees":\n\t\temitAjax({\n\t\t\turl: "/v1/webimplugin/tenants/"\n\t\t\t\t+ tenantId\n\t\t\t\t+ "/evaluationdegrees"\n\t\t\t\t+ "?orgName=" + params.orgName\n\t\t\t\t+ "&appName=" + params.appName\n\t\t\t\t+ "&userName=" + params.userName\n\t\t\t\t+ "&token=" + params.token,\n\t\t\tmsg: msg,\n\t\t\ttype: "GET",\n\t\t\texcludeData: true\n\t\t});\n\t\tbreak;\n\tcase "getAppraiseTags":\n\t\temitAjax({\n\t\t\turl: "/v1/webimplugin/tenants/"\n\t\t\t\t+ tenantId\n\t\t\t\t+ "/evaluationdegrees/"\n\t\t\t\t+ params.evaluateId\n\t\t\t\t+ "/appraisetags"\n\t\t\t\t+ "?orgName=" + params.orgName\n\t\t\t\t+ "&appName=" + params.appName\n\t\t\t\t+ "&userName=" + params.userName\n\t\t\t\t+ "&token=" + params.token,\n\t\t\tmsg: msg,\n\t\t\ttype: "GET",\n\t\t\texcludeData: true\n\t\t});\n\t\tbreak;\n\tcase "grayScale":\n\t\temitAjax({\n\t\t\turl: "/v1/grayscale/tenants/" + tenantId,\n\t\t\tmsg: msg,\n\t\t\ttype: "GET",\n\t\t\texcludeData: true,\n\t\t});\n\t\tbreak;\n\tcase "getCustomEmojiPackages":\n\t\temitAjax({\n\t\t\turl: "/v1/webimplugin/emoj/tenants/" + tenantId + "/packages",\n\t\t\tmsg: msg,\n\t\t\ttype: "GET",\n\t\t\texcludeData: true,\n\t\t});\n\t\tbreak;\n\tcase "getCustomEmojiFiles":\n\t\temitAjax({\n\t\t\turl: "/v1/webimplugin/emoj/tenants/" + tenantId + "/files",\n\t\t\tmsg: msg,\n\t\t\ttype: "GET",\n\t\t\texcludeData: true,\n\t\t});\n\t\tbreak;\n\tcase "getSatisfactionTipWord":\n\t\temitAjax({\n\t\t\turl: "/v1/webimplugin/tenants/" + tenantId + "/options/GreetingMsgEnquiryInvite",\n\t\t\ttype: "GET",\n\t\t\tmsg: msg,\n\t\t\texcludeData: true,\n\t\t});\n\t\tbreak;\n\tdefault:\n\t\tconsole.error("unexpect api name: " + apiName);\n\t\tbreak;\n\t}\n}, ["data"]);\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/js/transfer/api.js\n ** module id = 1\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/js/transfer/api.js?')},function(module,exports){eval('var EMPTYFN = function(){};\nvar _createStandardXHR = function(){\n\ttry{\n\t\treturn new window.XMLHttpRequest();\n\t}\n\tcatch(e){\n\t\treturn false;\n\t}\n};\nvar _createActiveXHR = function(){\n\ttry{\n\t\treturn new window.ActiveXObject("Microsoft.XMLHTTP");\n\t}\n\tcatch(e){\n\t\treturn false;\n\t}\n};\n\nmodule.exports = function(options){\n\tvar dataType = options.dataType || "text";\n\tvar suc = options.success || EMPTYFN;\n\tvar error = options.error || EMPTYFN;\n\tvar useXDomainRequestInIE = options.useXDomainRequestInIE;\n\tvar xhr = _createStandardXHR() || _createActiveXHR();\n\tvar type = options.type || "GET";\n\tvar data = options.data || {};\n\tvar tempData = "";\n\tvar headers = options.headers || {};\n\tvar isFileUpload = options.isFileUpload;\n\tvar disableTimeStampInGet = options.disableTimeStampInGet;\n\tvar key;\n\tvar fileForm;\n\tvar o;\n\n\tif(useXDomainRequestInIE && window.XDomainRequest){\n\t\txhr = new XDomainRequest();\n\t\txhr.onload = function(){\n\t\t\tvar parsedJSON = {};\n\t\t\ttry{\n\t\t\t\tparsedJSON = JSON.parse(xhr.responseText);\n\t\t\t}\n\t\t\tcatch(e){}\n\t\t\tsuc(parsedJSON, xhr);\n\t\t};\n\t\txhr.ontimeout = function(){\n\t\t\terror(xhr.responseText, xhr, "XDomainRequest timeout.");\n\t\t};\n\t\txhr.onerror = function(){\n\t\t\terror(xhr.responseText, xhr, "XDomainRequest error.");\n\t\t};\n\t\txhr.open("POST", options.url);\n\t\txhr.send(JSON.stringify(data));\n\t\treturn xhr;\n\t}\n\n\txhr.onreadystatechange = _onReadyStateChange;\n\tif(type.toLowerCase() === "get"){\n\t\tfor(o in data){\n\t\t\tif(Object.prototype.hasOwnProperty.call(data, o)){\n\t\t\t\ttempData += o + "=" + data[o] + "&";\n\t\t\t}\n\t\t}\n\t\t// todo: use Array.prototype.join\n\t\ttempData = tempData ? tempData.slice(0, -1) : tempData;\n\t\toptions.url += (options.url.indexOf("?") > 0 ? "&" : "?")\n\t\t\t+ (tempData ? tempData + "&" : tempData)\n\t\t\t// 在需要读取缓存资源时不加时间戳\n\t\t\t+ (disableTimeStampInGet ? "" : "_v=" + new Date().getTime());\n\t}\n\telse if(isFileUpload){\n\t\tfileForm = new FormData();\n\t\tfileForm.append("file", data.file);\n\n\t\txhr.open("POST", options.url);\n\t\txhr.setRequestHeader("Authorization", data.auth);\n\t\txhr.send(fileForm);\n\t\treturn xhr;\n\t}\n\telse{\n\t\tdata = JSON.stringify(data);\n\t}\n\txhr.open(type, options.url);\n\tif(xhr.setRequestHeader){\n\t\theaders["Content-Type"] = headers["Content-Type"] || "application/json";\n\n\t\tfor(key in headers){\n\t\t\tif(Object.prototype.hasOwnProperty.call(headers, key)){\n\t\t\t\txhr.setRequestHeader(key, headers[key]);\n\t\t\t}\n\t\t}\n\t}\n\n\txhr.send(data);\n\treturn xhr;\n\n\tfunction _onReadyStateChange(){\n\t\tvar json;\n\n\t\tif(xhr.readyState === 4){\n\t\t\tif(xhr.status === 200){\n\t\t\t\tif(dataType === "text"){\n\t\t\t\t\tsuc(xhr.responseText, xhr);\n\t\t\t\t\treturn;\n\t\t\t\t}\n\t\t\t\tif(dataType === "json"){\n\t\t\t\t\ttry{\n\t\t\t\t\t\tjson = JSON.parse(xhr.responseText);\n\t\t\t\t\t\tsuc(json, xhr);\n\t\t\t\t\t}\n\t\t\t\t\tcatch(e){}\n\t\t\t\t\treturn;\n\t\t\t\t}\n\t\t\t\tsuc(xhr.response || xhr.responseText, xhr);\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\tif(dataType == "json"){\n\t\t\t\ttry{\n\t\t\t\t\tjson = JSON.parse(xhr.responseText);\n\t\t\t\t\terror(json, xhr, "error response.");\n\t\t\t\t}\n\t\t\t\tcatch(e){\n\t\t\t\t\terror(xhr.responseText, xhr, "JSON parse error.");\n\t\t\t\t}\n\t\t\t\treturn;\n\t\t\t}\n\t\t\terror(xhr.responseText, xhr, "error response.");\n\t\t}\n\t\telse if(xhr.readyState === 0){\n\t\t\terror(xhr.responseText, xhr, "unexpected server error.");\n\t\t}\n\t}\n};\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/js/common/ajax.js\n ** module id = 2\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/js/common/ajax.js?')},function(module,exports){eval('\n\nvar isPostMessageSupportObj = (function(){\n\tvar supportObject = true;\n\ttry{\n\t\twindow.postMessage({\n\t\t\ttoString: function(){\n\t\t\t\tsupportObject = false;\n\t\t\t}\n\t\t}, "*");\n\t}\n\tcatch(e){}\n\treturn supportObject;\n})();\n\nfunction handleMsg(e, callback, accept){\n\t// 兼容旧版的标志\n\tvar flag = false;\n\tvar data = e.data;\n\tvar msg;\n\tvar i;\n\tvar l;\n\n\t// 47.9 及以后的版本 postMessage 会传 object （如果浏览器支持的话）\n\tif(typeof data === "object"){\n\t\tmsg = data;\n\t}\n\t// 47.9 以前的版本或者浏览器不支持时 postMessage 会传 JSON.stringigy 后得到的字符串，需要解析\n\telse if(typeof data === "string"){\n\t\ttry{\n\t\t\tmsg = JSON.parse(data);\n\t\t}\n\t\tcatch(err){}\n\n\t\tif(typeof msg !== "object"){\n\t\t\treturn;\n\t\t}\n\t}\n\n\tif(accept && accept.length){\n\t\tfor(i = 0, l = accept.length; i < l; i++){\n\t\t\tif(msg.key === accept[i]){\n\t\t\t\tflag = true;\n\t\t\t\ttypeof callback === "function" && callback(msg);\n\t\t\t}\n\t\t}\n\t}\n\telse{\n\t\ttypeof callback === "function" && callback(msg);\n\t}\n\n\tif(!flag && accept){\n\t\tfor(i = 0, l = accept.length; i < l; i++){\n\t\t\tif(accept[i] === "data"){\n\t\t\t\ttypeof callback === "function" && callback(msg);\n\t\t\t\tbreak;\n\t\t\t}\n\t\t}\n\t}\n}\n\nvar Transfer = function(iframeId, key, useObject){\n\tif(!(this instanceof Transfer)){\n\t\treturn new Transfer(iframeId);\n\t}\n\tthis.key = key;\n\tthis.iframe = document.getElementById(iframeId);\n\tthis.origin = location.protocol + "//" + location.host;\n\tthis.useObject = useObject;\n};\n\nTransfer.prototype.send = function(msg, to){\n\n\tmsg.origin = this.origin;\n\n\tmsg.key = this.key;\n\n\tif(this.to){\n\t\tmsg.to = this.to;\n\t}\n\telse if(to){\n\t\tmsg.to = to;\n\t}\n\n\t// this.useObject 在实例化时指定\n\t// msg.useObject 在调用 send 时指定\n\t// 这两种情况都有效，之所以这样设计是为了兼容老版本\n\t// 因为 em-transfer.js 总是最新版的，main.js 可能是老版本的\n\t// 所以需要在通信的 msg 中增加 useObject，用来指示使用哪种方式\n\tif(!(isPostMessageSupportObj && (this.useObject || msg.useObject))){\n\t\tmsg = JSON.stringify(msg);\n\t}\n\n\tif(this.iframe){\n\t\tthis.iframe.contentWindow.postMessage(msg, "*");\n\t}\n\telse{\n\t\twindow.parent.postMessage(msg, "*");\n\t}\n\treturn this;\n};\n\nTransfer.prototype.listen = function(callback, accept){\n\tvar me = this;\n\n\tif(window.addEventListener){\n\t\twindow.addEventListener("message", function(e){\n\t\t\thandleMsg.call(me, e, callback, accept);\n\t\t}, false);\n\t}\n\telse if(window.attachEvent){\n\t\twindow.attachEvent("onmessage", function(e){\n\t\t\thandleMsg.call(me, e, callback, accept);\n\t\t});\n\t}\n\treturn this;\n};\n\nmodule.exports = Transfer;\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/js/common/transfer.js\n ** module id = 3\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/js/common/transfer.js?')},function(module,exports,__webpack_require__){eval('module.exports = __webpack_require__.p + "../../transfer.html";\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/html/transfer.html\n ** module id = 4\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/html/transfer.html?')}]);