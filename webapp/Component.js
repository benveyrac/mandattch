sap.ui.define([
    "sap/ui/core/UIComponent",
    "com/smurfitwestrock/mdg/mandattch/model/models"
], (UIComponent, models) => {
    "use strict";

    return UIComponent.extend("com.smurfitwestrock.mdg.mandattch.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // enable routing
            this.getRouter().initialize();

            let aParameters = this.getURLParameters();
            // oParam.value

            if (aParameters !== undefined) {
                var oParam = aParameters.find(oParameter => oParameter.key === "MDChgProcessSrceObject");
                if (oParam !== undefined) {
                    this.getRouter().navTo("RouteAttach", {
                        MDChgProcessSrceObject: oParam.value
                    }, true);
                }
            }
        },

        // Lecture des paramètres URL
        getURLParameters() {
            var complete_url = window.location.href;
            var pieces = complete_url.split("?");
            var aParameters = [];
            $.each(pieces, function (key, value) {
                var params = value.split("&");
                $.each(params, function (key, value) {
                    var param_value = value.split("=");
                    aParameters.push({
                        'key': param_value[0],
                        'value': param_value[1]
                    });
                });
            });
            return aParameters;
        }
    });
});