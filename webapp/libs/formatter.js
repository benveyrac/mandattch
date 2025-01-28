sap.ui.define([], function () {
    "use strict";
    return {
        setStatusText: function (Status) {
            var vText;
            switch (Status) {
                case "10":
                    vText = this.getText("stat.inc");
                    break;
                case "01":
                    vText = this.getText("stat.com");
                    break;
            }
            return vText;
        },

        setStatusIcon: function (Status) {
            var vIcon;
            switch (Status) {
                case "10":
                    vIcon = "sap-icon://alert";
                    break;
                case "01":
                    vIcon = "sap-icon://sys-enter-2";
                    break;
            }
            return vIcon;
        },

        setStatusState: function (Status) {
            var vState;
            switch (Status) {
                case "10":
                    vState = sap.ui.core.ValueState.Error;
                    break;
                case "01":
                    vState = sap.ui.core.ValueState.Success;
                    break;
            }
            return vState;
        },

        setBPName: function (NameLast, NameFirst, NameOrg1) {
            var vName;
            if (NameOrg1) {
                vName = NameOrg1;
            } else {
                vName = NameFirst + ' ' + NameLast;
            }
            return vName;
        }        
    };
});