sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
    "sap/ui/model/resource/ResourceModel"
], function (JSONModel, Device, ResourceModel) {
    "use strict";

    return {
        // INI MOD OFO Control de errores 17/03/2022
        //Function model read
        get: function (ref, oModel, entidad, filtros, parametros, fnSuccess, fnError, sorter) {
            if (sorter === undefined || sorter === null || sorter === "") {
                sorter = [];
            }

            var that = this;

            var successFn = function (data, header) {
                var response = header.headers["sap-message"];
                if (response && (JSON.parse(response).severity === "error" || JSON.parse(response).code === 'ZPM_MSG/150')) {
                    var err = {
                        statusCode: "400",
                        statusText: JSON.parse(response).message
                    }
                    that.error(err, ref);
                } else {
                    if (fnSuccess) { fnSuccess(data, header) }
                }
            };

            var errorFn = function (err) {
                if (fnError) { fnError(err) }
                that.error(err, ref);
            };

            oModel.read(entidad, {
                urlParameters: parametros,
                filters: filtros,
                sorters: sorter,
                success: successFn,
                error: errorFn
            });
        },

        // FIN MOD OFO Control de errores 17/03/2022

        create: function (ref, oModel, entidad, odata, fnsuccess, error, parametros) {

            var that = this;

            var successBack = function (data, header) {
                var response = header.headers["sap-message"];
                if (response && (JSON.parse(response).severity === "error" || JSON.parse(response).code === 'ZPM_MSG/150')) {
                    var err = {
                        statusCode: "400",
                        statusText: JSON.parse(header.headers["sap-message"]).message
                    }
                    that.error(err, ref);
                } else {
                    if (header.statusCode.indexOf("20") !== -1) {
                        if (fnsuccess) { fnsuccess(data, header) }
                    }else{
                        var err = {
                            statusCode: header.statusCode,
                            statusText: header.statusText
                        }
                        that.error(err, ref);
                    }
                }
            };

            var errorBack = function (err) {
                if (error) { error(err) }
                that.error(err, ref);
            };
            oModel.create(entidad, odata, {
                success: successBack,
                error: errorBack,
                urlParameters: parametros
            });
        },
        update: function (ref, oModel, entidad, id, odata, parametros, success, error) {

            var that = this;

            var successFn = function (data, header) {
                var response = header.headers["sap-message"];
                if (response && (JSON.parse(response).severity === "error" || JSON.parse(response).code === 'ZPM_MSG/150')) {
                    var err = {
                        statusCode: "400",
                        statusText: JSON.parse(header.headers["sap-message"]).message
                    }
                    that.error(err, ref);
                } else {
                    if (success) { success(data, header) }
                }
            };

            var errorFn = function (err) {
                if (error) { error(err) }
                //INI MOD OFO Gestión Concurrencia 19/05/2022
                if (JSON.parse(err.responseText)) {
                    if (JSON.parse(err.responseText).error.innererror.statusCode === 409) {
                        err = {
                            statusCode: "400",
                            statusText: JSON.parse(err.responseText).error.innererror.statusText
                        }
                        that.error(err, ref);
                    }
                } else {
                    that.error(err, ref);
                }
                //FIN MOD OFO Gestión Concurrencia 19/05/2022
            };

            oModel.update(entidad + "('" + id + "')", odata, {
                success: successFn,
                error: errorFn,
                urlParameters: parametros
            });
        },
        updateMulti: function (ref, oModel, entidad, id, odata, parametros, success, error, fnClose) {

            var that = this;

            var successFn = function (data, header) {
                var response = header.headers["sap-message"];
                if (response && (JSON.parse(response).severity === "error" || JSON.parse(response).code === 'ZPM_MSG/150')) {
                    var err = {
                        statusCode: "400",
                        statusText: JSON.parse(header.headers["sap-message"]).message
                    }
                    that.error(err, ref, fnClose);
                } else {
                    if (success) { success(data, header) }
                }
            };

            var errorFn = function (err) {
                if (error) { error(err) }
                that.error(err, ref, fnClose);
            };

            oModel.update(entidad + "(" + id + ")", odata, {
                success: successFn,
                error: errorFn,
                urlParameters: parametros
            });
        },
        delete: function (ref, oModel, entidad, success, error, fnClose) {
            var that = this;

            var successFn = function (data, header) {
                var response = header.headers["sap-message"];
                if (response && (JSON.parse(response).severity === "error" || JSON.parse(response).code === 'ZPM_MSG/150')) {
                    var err = {
                        statusCode: "400",
                        statusText: JSON.parse(header.headers["sap-message"]).message
                    }
                    that.error(err, ref, fnClose);
                } else {
                    if (success) { success(data, header) }
                }

            };

            var errorFn = function (err) {
                if (error) { error(err) }
                that.error(err, ref, fnClose);
            };

            oModel.delete(entidad, {
                success: successFn,
                error: errorFn
            });
        },

        // INI MOD OFO Control de errores 17/03/2022

        //Function to show error message
        error: function (err, vthat, vfnClose) {
            var errorMsg = "";
            var i18nModel = vthat.getView().getModel("i18n").getResourceBundle();

            // Set Busy to false
            vthat.getView().setBusy(false);

            //Configure error message
            switch (err.statusCode) {
                case 0:
                    errorMsg = i18nModel.getText("Error");
                    break;

                case "400":
                    if (err.responseText && (JSON.parse(err.responseText).error.code.includes('/IWFND/CM_MGW') || JSON.parse(err.responseText).error.code.includes('SY'))) {
                        errorMsg = JSON.parse(err.responseText).error.message.value;
                    } else {
                        errorMsg = err.statusText;
                    }

                    break;

                case "403":
                    errorMsg = i18nModel.getText("Error403");
                    break;

                case "404":
                    errorMsg = i18nModel.getText("Error404");
                    break;

                case "500":
                    errorMsg = i18nModel.getText("Error500");
                    break;

                case "504":
                    errorMsg = i18nModel.getText("Error504");
                    break;

                default:
                    errorMsg = i18nModel.getText("ErrorDefault");
                    break;
            }

            //Try to show message
            try {
                sap.m.MessageBox.error(errorMsg, {
                    title: "Error",
                    onClose: function () {
                        if (vfnClose) { vfnClose() }
                    },
                    styleClass: "",
                    id: "Error",
                    actions: sap.m.MessageBox.Action.CLOSE,
                    emphasizedAction: null,
                    initialFocus: null,
                    textDirection: sap.ui.core.TextDirection.Inherit
                });
            } catch (e) {
                console.log("Multiples errror messages");
            }

        },

        // FIN MOD OFO Control de errores 17/03/2022

        errorXS: function (that, err, fnClose, parameters) {
            var errorMsg;
            var i18nModel = that.getView().getModel("i18n").getResourceBundle();
            if (that) {
                if (that.getView()) {
                    that.getView().setBusy(false);
                }
            }
            switch (err.status) {
                case 0:
                    errorMsg = i18nModel.getText("Error");
                    break;

                case 403:
                    errorMsg = i18nModel.getText("Error403");
                    break;

                case 404:
                    errorMsg = i18nModel.getText("Error404");
                    break;

                case 500:
                    errorMsg = i18nModel.getText("Error500");
                    break;

                case 504:
                    errorMsg = i18nModel.getText("Error504");
                    break;

                default:
                    errorMsg = err.responseJSON.response;
                    break;
            }
            try {
                sap.m.MessageBox.error(errorMsg, {
                    title: "Error",
                    onClose: function () {
                        if (fnClose) { fnClose() }
                    },
                    styleClass: "",
                    id: "Error",
                    actions: sap.m.MessageBox.Action.CLOSE,
                    emphasizedAction: null,
                    initialFocus: null,
                    textDirection: sap.ui.core.TextDirection.Inherit
                });
            } catch (e) {
                console.log("Multiple error messages");
            }

        }

    };
});