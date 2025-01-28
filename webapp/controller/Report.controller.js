sap.ui.define([
    "com/smurfitwestrock/mdg/mandattch/controller/BaseController",
], (BaseController) => {
    "use strict";

    return BaseController.extend("com.smurfitwestrock.mdg.mandattch.controller.Report", {
        onInit() {
            this.getRouter().getRoute("RouteReport").attachMatched(this._onRouteReport, this);
        },

        _onRouteReport() {

        },

        onPartner(oEvent) {
            let sLine = oEvent.getSource().getBindingContext().getObject();

            this.getRouter().navTo("RouteAttach", {
                MDChgProcessSrceObject: sLine.MDChgProcessSrceObject
            }, true);
        }

    });
});