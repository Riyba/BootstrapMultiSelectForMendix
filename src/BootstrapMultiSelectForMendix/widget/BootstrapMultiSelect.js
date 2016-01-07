/*
    BootstrapMultiSelectForMendix
    ========================

    @file      : BootstrapMultiSelect.js
    @version   : 1.6
    @author    : Iain Lindsay
    @date      : Thu, 07 Jan 2016 16:06:00 GMT
    @copyright : AuraQ Limited 2016
    @license   : Apache v2

    Documentation
    ========================
    This widget is a wrapper for the Bootstrap multi select control by David Stutz:
    https://github.com/davidstutz/bootstrap-multiselect
    
    Available options are held in a separate entity, selected items are stored in a reference set association to that entity.
*/
require({
    packages: [{
         name: 'jqwrapper',
         location: '../../widgets/BootstrapMultiSelectForMendix/lib',
         main: 'jqwrapper'
    }, {
         name: 'bootstrap',
         location: '../../widgets/BootstrapMultiSelectForMendix/lib',
         main: 'bootstrap'
    }, {
         name: 'bootstrap-multiselect',
         location: '../../widgets/BootstrapMultiSelectForMendix/lib',
         main: 'bootstrap-multiselect'
    }]
    }, [
    'dojo/_base/declare', 
    'mxui/widget/_WidgetBase', 
    'dijit/_TemplatedMixin', 
    'dijit/_AttachMixin',
    'mxui/dom', 
    'dojo/dom', 
    'dojo/query', 
    'dojo/dom-prop', 
    'dojo/dom-geometry', 
    'dojo/dom-class', 
    'dojo/dom-style', 
    'dojo/dom-construct', 
    'dojo/_base/array', 
    'dojo/_base/lang', 
    'dojo/text', 
    'dojo/html', 
    'dojo/_base/event',
    'jqwrapper',
    'bootstrap',
    'bootstrap-multiselect',
    'dojo/text!BootstrapMultiSelectForMendix/widget/templates/BootstrapMultiSelect.html'
], function (declare, _WidgetBase, _TemplatedMixin, _AttachMixin, dom, dojoDom, domQuery, domProp, domGeom, domClass, domStyle, domConstruct, dojoArray, lang, text, html, event, _jqwrapper, _bootstrap, _bootstrapMultiSelect, widgetTemplate) {
    'use strict';

    var $ = _jqwrapper;
    $ = _bootstrap.createInstance($);
    $ = _bootstrapMultiSelect.createInstance($);
    
    return declare('BootstrapMultiSelectForMendix.widget.BootstrapMultiSelect', [_WidgetBase, _TemplatedMixin], {

        templateString: widgetTemplate,

        dataAssociation: "",
        dataAttribute: "",
        fieldCaption: "",
        formOrientation: "",

        _entity: null,      
        _labelAttribute: null,  
        _reference: null,
        _handles: null,
        _contextObj: null,
        _$alertdiv: null,
        _$combo: null,
        _comboData : [],
        _sortParams : [],

        constructor: function () {
            this._handles = [];
        },        

        postCreate: function (obj) {

            this._entity = this.dataAssociation.split('/')[1];
            this._reference = this.dataAssociation.split('/')[0];
            this._labelAttribute = this.labelAttribute.split('/')[2];
                        
            // issues with the sort parameters being persisted between widget instances mean we set the sort array to empty.
            this._sortParams = [];
            // create our sort order array
            for(var i=0;i<this.sortContainer.length;i++) {
                var item = this.sortContainer[i];
                this._sortParams.push([item.sortAttribute, item.sortOrder]);
            }
            
            // make sure we only select the control for the current id or we'll overwrite previous instances
            var selector = '#' + this.id + ' select.multiSelect';
            this._$combo = $(selector);  
            
            // adjust the template based on the display settings.
            if( this.showLabel ) {
                if(this.formOrientation === "horizontal"){
                    // width needs to be between 1 and 11
                    var comboLabelWidth = this.labelWidth < 1 ? 1 : this.labelWidth;
                    comboLabelWidth = this.labelWidth > 11 ? 11 : this.labelWidth;
                    
                    var comboControlWidth = 12 - comboLabelWidth,                    
                        comboLabelClass = 'col-sm-' + comboLabelWidth,
                        comboControlClass = 'col-sm-' + comboControlWidth;
                    
                    domClass.add(this.multiSelectLabel, comboLabelClass);
                    domClass.add(this.multiSelectComboContainer, comboControlClass);
                }

                this.multiSelectLabel.innerHTML = this.fieldCaption;
            }
            else {
                domClass.remove(this.multiSelectMainContainer, "form-group");
                domConstruct.destroy(this.multiSelectLabel);
            }
        },

        update: function (obj, callback) {
            
            var self = this;
            
            if (obj === null) {
                if (!domClass.contains(this.domNode, 'hidden')) {
                    domClass.add(this.domNode, 'hidden');
                }
            } else {
                if (domClass.contains(this.domNode, 'hidden')) {
                    domClass.remove(this.domNode, 'hidden');
                }
                this._contextObj = obj;
                this._resetSubscriptions();
                
                this._$combo.multiselect({
                    numberDisplayed : this.itemsToDisplay,
                    maxHeight: 200, // TODO... make this configurable
                    includeSelectAllOption: self.addSelectAll,
                    includeSelectAllDivider: self.addSelectAll,
                    buttonClass: 'form-control',
                    dropRight: true,                      
                    selectAllText : this.selectAllText,                      
                    nonSelectedText : this.noneSelectedText,                      
                    allSelectedText : this.allSelectedText,                      
                    nSelectedText : this.numberSelectedText,
                    onChange: function(option, checked, select) {
                        // in the absence of an 'onDeselectAll' event we assume
                        // its the selectall checkbox if the option value is undefined
                        if( option === undefined ) {
                            if (checked){
                                dojoArray.forEach(self._comboData, function (availableObject, index) {                
                                    var guid = availableObject.value;

                                    self._contextObj.addReference(self._reference, guid);
                                });
                            }
                            else{
                               dojoArray.forEach(self._comboData, function (availableObject, index) {                
                                    var guid = availableObject.value;

                                    self._contextObj.removeReferences(self._reference, [guid]);
                                });
                            }                            
                        }
                        else {
                            var guid = $(option).val();
                            if (checked){
                                self._contextObj.addReference(self._reference, guid);
                            }
                            else{
                                self._contextObj.removeReferences(self._reference, [guid]);
                            }
                        }
                        
                        // run the OC microflow if one has been configured.                   
                        if( self.onChangeMicroflow ) {
                            self._execMf(self._contextObj.getGuid(), self.onChangeMicroflow);
                        }
                    }
                });                            
                
                // load the available options and ticks the already associated options.
                this._loadComboData();
            }

            // Execute callback.
            if (typeof callback !== 'undefined') {
                callback();
            }
        },

        enable: function () {},

        disable: function () {},

        resize: function (box) {},

        uninitialize: function () {
            this._comboData = [];
            this._sortParams = [];
        },
        
        // retrieves the data from the child entity, applying the required constraint
        _loadComboData: function () {
            
            // reset our data
            this._comboData = [];
            
            var xpath = '//' + this._entity + this.dataConstraint.replace('[%CurrentObject%]', this._contextObj.getGuid());
            mx.data.get({
                xpath: xpath,
                filter: {
                    sort: this._sortParams,
                    offset: 0
                },
                callback: lang.hitch(this, this._processComboData)
            });
        },
        
        // sets up the available combo options
        _processComboData: function (objs) {
            var self = this;
            // reset our data
            self._comboData = [];            
            
            dojoArray.forEach(objs, function (availableObject, index) {
                
                var optionLabel = availableObject.get(self._labelAttribute),
                    optionValue = availableObject.getGuid(),
                    item = {
                        label: optionLabel, value: optionValue, selected: false
                    };    
                
                self._comboData.push(item);
            });
            
            // load and set the current associated data
            self._setReferencedObjects();            
        },

        // marks referenced objects as selected in the combo options.
        _setReferencedObjects: function () {           
            var self = this,
                referencedObjects = this._contextObj.get(this._reference);
            
            if(referencedObjects !== null && referencedObjects !== "") {
                dojoArray.forEach(self._comboData, function (availableObject, index) {                
                    //check if this is a current tag
                    dojoArray.forEach(referencedObjects, function (ref, i) {
                        if (availableObject.value === ref) {
                                availableObject.selected = true;
                        }
                    }, this);
                }, this);
            }
            
            // update array and set selected flag based on referenced options                
            self._$combo.multiselect('dataprovider', this._comboData);                
        },

        _execMf: function (guid, mf, cb) {
            if (guid && mf) {
                mx.data.action({
                    applyto: 'selection',
                    actionname: mf,
                    guids: [guid],
                    callback: function () {
                        if (cb) {
                            cb();
                        }
                    },
                    error: function (e) {
                        console.error('Error running Microflow: ' + e);
                    }
                }, this);
            }

        },

        _resetSubscriptions: function () {
            // Release handle on previous object, if any.
            var handle = null,
                attrHandle = null,
                validationHandle= null;

            if (this._handles) {
                dojoArray.forEach(this._handles, function (handle) {
                    this.unsubscribe(handle);
                });
                this._handles = [];
            }

            if (this._contextObj) {
                handle = this.subscribe({
                    guid: this._contextObj.getGuid(),
                    callback: function (guid) {
                        mx.data.get({
                            guid: guid,
                            callback: lang.hitch(this, function (obj) {
                                this._contextObj = obj;
                                this._loadComboData();
                            })
                        });

                    }
                });
                attrHandle = mx.data.subscribe({
                    guid: this._contextObj.getGuid(),
                    attr: this.attribute,
                    callback: lang.hitch(this, function (guid) {
                        mx.data.get({
                            guid: guid,
                            callback: lang.hitch(this, function (obj) {
                                this._contextObj = obj;
                                this._loadComboData();
                            })
                        });
                    })
                });


                validationHandle = mx.data.subscribe({
                    guid: this._contextObj.getGuid(),
                    val: true,
                    callback: lang.hitch(this, this._handleValidation)
                });

                this._handles.push(handle);
                this._handles.push(attrHandle);
                this._handles.push(validationHandle);
            }
        },
        
        _handleValidation: function (validations) {

            this._clearValidations();

            var val = validations[0],
                msg = val.getReasonByAttribute(this._reference);

            if (this.readOnly) {
                val.removeAttribute(this._reference);
            } else {
                if (msg) {
                    this._addValidation(msg);
                    val.removeAttribute(this._reference);
                }
            }
        },

        _clearValidations: function () {
            if( this._$alertdiv ) {
                this._$combo.parent().removeClass('has-error');
                this._$alertdiv.remove();
            }
        },

        _addValidation: function (msg) {            
            this._$alertdiv = $("<div></div>").addClass('alert alert-danger mx-validation-message').html(msg);
            this._$combo.parent().addClass('has-error').append( this._$alertdiv );            
        }
    });
});
require(['BootstrapMultiSelectForMendix/widget/BootstrapMultiSelect'], function () {
    'use strict';
});