sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
    "sap/m/MessagePopover",
    "sap/m/MessageItem",
], function (Controller, JSONModel, History, MessagePopover, MessageItem) { // ATTENTION: les paramètres doivent être dans le même ordre que les références
    "use strict";

    //Le but est de centraliser ici toutes les méthodes qui peuvent être mutualisées et utilisées par tous les controllers de l'application à condition qu'ils l'étendent.

    //Extension de Controller: BaseControler.js hérite de toutes les fonctions et attributs définis dans Controller.js
    return Controller.extend("com.smurfitwestrock.mdg.controller.BaseController", {
        getRouter: function () {
            return this.getOwnerComponent().getRouter(); //On récupère le Router qui est situé dans le Componnent.js
        },

        getText: function (sText, aParam) {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(sText, aParam);
        },

        getModel: function (sModel) {
            return this.getOwnerComponent().getModel(sModel);
        },

        setModel: function (sModel, oData) {
            this.getOwnerComponent().setModel(sModel, oData);
        },

        getDataService: function () {
            return this.getOwnerComponent().getDataService();
        },

        initializeViewModel: function (oData, sName) {
            this.getView().setModel(oData, sName);
        },

        initializeViewJModel: function (sName, oData) {
            this.getView().setModel(new JSONModel(oData), sName);
            this.getView().bindElement(sName + '>/');
        },

        getViewModel: function (sName) {
            return this.getView().getModel(sName);
        },

        onNavBack: function () {
            var oPrev = History.getInstance().getPreviousHash();
            if (oPrev !== undefined) {
                window.history.go(-1);
            } else {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteReport", true);
            }
        },

        /////////////////////////// GESTION DU POPOVER ///////////////////////////
        //Create the Message Popover
        createMessagePopover: function () {
            this.oMessagePopover = new MessagePopover({
                activeTitlePress: function (oEvent) { //triggered at click on the message active title link
                    const oItem = oEvent.getParameter("item");
                    const oMessage = oItem.getBindingContext("message").getObject(); //Get the message instance
                    const oControl = sap.ui.getCore().byId(oMessage.getControlId()); //Get the control associated to the message
                    if (oControl) {
                        setTimeout(function () {
                            oControl.focus();
                            oControl.selectText(0, 99);
                        }, 300);
                    }
                },
                items: {
                    path: "message>/",
                    template: new MessageItem({
                        title: "{message>message}",
                        subtitle: "{message>additionalText}",
                        activeTitle: {
                            parts: [{
                                path: 'message>controlIds'
                            }],
                            formatter: this.isPositionable
                        }, //controlId is set Only for controls bound to a model					
                        type: "{message>type}", //Convert Information to Success
                        description: "{message>message}"
                    })
                }
            });

            // this.oMessagePopover._oMessageView.setGroupItems(true);
            if (this.getView().byId("messagePopoverBtn")) {
                this.getView().byId("messagePopoverBtn").addDependent(this.oMessagePopover);
            }
        },

        isPositionable: function (sControlIds) {
            // Such a hook can be used by the application to determine if a control can be found/reached on the page and navigated to.	
            if (sControlIds && sControlIds.length > 0) {
                return true;
            }
            return false;
        },

        getMessageManager: function () {
            return this.oMessageManager;
        },

        removeAllMessages: function () {
            this.getMessageManager().removeAllMessages();
        },

        handleMessagePopoverPress: function (oEvent) {
            if (!this.oMessagePopover) {
                this.createMessagePopover();
            }
            this.oMessagePopover.toggle(oEvent.getSource());
        },

        openMessagePopover: function () {
            if (!this.oMessagePopover) {
                this.createMessagePopover();
            }
            const oControl = this.oMessagePopover.getEventingParent();
            if (oControl.getVisible()) {
                this.oMessagePopover.openBy(oControl);
            }
        },

        closeMessagePopover: function () {
            if (this.oMessagePopover) {
                this.oMessagePopover.close();
            }
        }
    });
});