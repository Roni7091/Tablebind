sap.ui.define([
    'sap/m/MessageBox',
    
    'sap/ui/core/mvc/Controller',
    'sap/ui/core/util/Export',
    'sap/ui/core/util/ExportTypeCSV',
    'sap/ui/model/json/JSONModel',
    'sap/ui/core/Fragment',
    "sap/ui/core/syncStyleClass",
    "sap/m/Button",
    "sap/m/library"
], function(MessageBox, Controller, Export, ExportTypeCSV, JSONModel, Fragment, syncStyleClass,Button ,library) {
"use strict";

var TableController = Controller.extend("com.example.tablebind.controller.Table", {

    onInit : function() {
        // set explored app's demo model on this sample
        var oModel = new JSONModel(sap.ui.require.toUrl("com/example/tablebind/model/mockdata/tabledata.json"));
        this.getView().setModel(oModel);

    },
    onDeleteTablerow: function (oEvent) {
        var oTable = this.getView().byId("Tabid");
        var aSelectedItems = oTable.getSelectedItems();

        for(var i=0; i<aSelectedItems.length; i++){
            oTable.removeItem(aSelectedItems[i])
        }
    },
    onCopybutton: function(oEvent) {
        var oTable = this.byId("Tabid");
        var aSelectedItems = oTable.getSelectedItems();
        var aData = oTable.getModel().getProperty("/ProductCollection");
        var aNewData = [];
        for (var i = 0; i < aSelectedItems.length; i++) {
            var oItem = aSelectedItems[i];
            var oItemData = oItem.getBindingContext().getObject();
            var oNewData = {};
            for (var sKey in oItemData) {
                oNewData[sKey] = oItemData[sKey];
            }
            aNewData.push(oNewData);
        }
        var aCombinedData = aData.concat(aNewData);
        oTable.getModel().setProperty("/ProductCollection", aCombinedData);
    },
        onDialogbox: function (oEvent) {
            var oView = this.getView();
            if (!this._pDialog) {
                this._pDialog = Fragment.load({
                    id: oView.getId(),
                    name: "com.example.tablebind.view.fragment.Box",
                    controller: this
                }).then(function(oDialog){
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }
        
            this._pDialog.then(function(oDialog){
                // toggle compact style for the dialog
                syncStyleClass("sapUiSizeCompact", oView, oDialog);
                oDialog.open();
            });
        },
        onCloseboxbutton: function (oEvent) {
            this._pDialog.then(function(oDialog){
                oDialog.close();
            });
        },

    onDataExport : function(oEvent) {

        var oExport = new Export({

            // Type that will be used to generate the content. Own ExportType's can be created to support other formats
            exportType : new ExportTypeCSV({
                separatorChar : ",",
                charset: "utf-8"
            }),

            // Pass in the model created above
            models : this.getView().getModel(),

            // binding information for the rows aggregation
            rows : {
                path : "/ProductCollection"
            },

            // column definitions with column name and binding info for the content

            columns : [{
                name : "Product",
                template : {
                    content : "{Name}"
                }
            }, {
                name : "Product ID",
                template : {
                    content : "{ProductId}"
                }
            }, {
                name : "Supplier",
                template : {
                    content : "{SupplierName}"
                }
            
            }, {
                name : "Weight",
                template : {
                    content : "{WeightMeasure} {WeightUnit}"
                }
            }, {
                name : "Price",
                template : {
                    content : "{Price} {CurrencyCode}"
                }
            }]
        });

        // download exported file
        oExport.saveFile().catch(function(oError) {
            MessageBox.error("Error when downloading data. Browser might not be supported!\n\n" + oError);
        }).then(function() {
            oExport.destroy();
        });
    },
    onSelectionModeChange: function(oEvent) {
        var oTable = this.byId("table");
        var sKey = oEvent.getParameter("selectedItem").getKey();

        oTable.setSelectionMode(sKey);
    },
    onAddbutton: function (oEvent) {                              
        var oItem = new sap.m.ColumnListItem({
            cells: [new sap.m.Input({       
            }), new sap.m.Input(),new sap.m.Input(), new sap.m.Input(), new sap.m.Input({
                showValueHelp: true
     
            }), ]
       });
    
       var oTable = this.getView().byId("Tabid");
       oTable.addItem(oItem);
    },

});


return TableController;

});