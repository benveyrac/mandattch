sap.ui.define([
    "com/smurfitwestrock/mdg/mandattch/controller/BaseController",
    "com/smurfitwestrock/mdg/mandattch/libs/formatter",
], (BaseController, formatter) => {
    "use strict";

    return BaseController.extend("com.smurfitwestrock.mdg.mandattch.controller.Report", {
        formatter: formatter,

        onInit() {
            this.getView().unbindObject();
            this.getRouter().getRoute("RouteAttach").attachMatched(this._onRouteDetail, this);
        },

        _onRouteDetail(oEvent) {
            this.getView().setModel(this.getModel(), 'MdtStatus');

            let oProcessId = oEvent.getParameter("arguments").MDChgProcessSrceObject;
            if (oProcessId) {
                this.getView().setBusy(true);

                this.getModel().metadataLoaded().then(() => {
                    let sKey = this.getModel().createKey("/ZC_PARTNER_MDG", {
                        MDChgProcessSrceObject: oProcessId
                    });
                    this.getModel().invalidateEntry(sKey);

                    this.getView().bindObject({
                        path: sKey,
                        events: {
                            change: (oData) => {
                                this.getView().setBusy(false);
                            },
                            dataReceived: (oDataReceived) => {
                                let oData = oDataReceived.getParameter('data');
                                this.fillMdtAttachStatus(oData.MDChgProcessSrceObject, oData.MasterDataChangeProcess);
                            }
                        }
                    });
                });
            }
        },


        fillMdtAttachStatus: function (SourceId, ProcessId) {
            if (SourceId) {
                this.getView().setBusy(true);

                this.getModel().metadataLoaded().then(() => {
                    let sKey = this.getModel().createKey("/MdtAttachStatusSet", {
                        SourceId: SourceId,
                        ProcessId: ProcessId                        
                    });
                    this.getModel().invalidateEntry(sKey);

                    this.getView().bindObject({
                        path: sKey,
                        model: 'MdtStatus',
                        events: {
                            change: (oData) => {
                                this.getView().setBusy(false);
                            },
                            dataReceived: (oDataReceived) => {},
                        }
                    });
                });
            }

        },

        // Sélection d'un type de document
        onSelectTypeExt: function (oEvent) {
            this.ComboType = this.getView().byId(oEvent.getSource().getId());
            let sKey = oEvent.getSource().getSelectedKey();
            if (sKey) {
                this.byId("UploadSet").setUploadEnabled(true);
            } else {
                this.byId("UploadSet").setUploadEnabled(false);
            }
        },

        onFilePressed(oEvent) {
            const oServiceUrl = this.getModel().sServiceUrl;
            const oItemData = oEvent.getSource().getBindingContext().getObject();

            const oKey = this.getModel().createKey('/FileSet', {
                SourceId: oItemData.MDChgProcessSrceObject,
                Type: oItemData.Type,
                Filename: oItemData.Filename
            });

            const sPath = oServiceUrl + oKey + "/$value";
            oEvent.getSource().setUrl(sPath);
        },

        // Modification des Url pour le chargement des fichiers
        _onFilesReceived() {
            const aUploadItem = this.byId("UploadSet").getItems();
            const oServiceUrl = this.getModel().sServiceUrl;

            aUploadItem.forEach(oItem => {
                const oItemContext = oItem.getBindingContext();
                const oData = oItemContext.getObject();

                const oKey = this.getModel().createKey('/FileSet', {
                    SourceId: oData.MDChgProcessSrceObject,
                    Type: oData.Type,
                    Filename: oData.Filename
                });
                const sPath = oServiceUrl + oKey + "/$value";

                oItem.setProperty('url', sPath);
            });
        },

        // Before Upload Starts define Slug and Tocken
        onBeforeUploadStartsExt(oEvent) {
            let oHeaderItem = oEvent.getParameter("item");
            oHeaderItem.removeAllStatuses();
            let oContext = this.getView().getBindingContext();

            let oTypeKey = this.ComboType.getSelectedKey();
            let oData = {
                MasterDataChangeProcess: oContext.getProperty("MasterDataChangeProcess") || "",
                MDChgProcessSrceObject: oContext.getProperty("MDChgProcessSrceObject") || "",
            }
            let oGuid = "";

            oHeaderItem.addHeaderField(new sap.ui.core.Item({
                key: "slug",
                text: oGuid + "@" + oData.MasterDataChangeProcess + "@" + oData.MDChgProcessSrceObject + "@" + oTypeKey + "@" + oHeaderItem.getFileName()
            }));
            oHeaderItem.addHeaderField(new sap.ui.core.Item({
                key: "x-csrf-token",
                text: this.getModel().getSecurityToken()
            }));

        },

        // At the complete upload
        onUploadCompletedExt(oEvent) {
            let oStatus = oEvent.getParameter("status");
            let oItem = oEvent.getParameter("item");
            oItem.setVisibleEdit(false);
            this.byId("UploadSet").setUploadEnabled(false);

            if (oStatus && oStatus !== 201) {
                oItem.setUploadState("Error");
                oItem.removeAllStatuses();
            } else {
                this.byId("UploadSet").getModel().refresh();
                this.getView().getModel("MdtStatus").refresh();
                this.ComboType.setSelectedKey();
            }
        },

        // Suppression d'un fichier #Attachment en attente d'ajout ou déjà ajouté.
        onAfterRemoveFileExt(oEvent) {
            // const sPath = oEvent.getParameter('item').getBindingContext('ZC_PARTNER_MDG').getPath() + "/$value";
            const sPath = oEvent.getParameter('item').getBindingContext().getPath();

            this.getModel().remove(sPath, {
                success: function (oData) {},
                error: function (oError) {}
            });
        },

    });
});