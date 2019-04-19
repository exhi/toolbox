import {HoistModel} from '@xh/hoist/core';
import {isString, difference, without, keys} from 'lodash';
import {settable, observable, action, bindable} from '@xh/hoist/mobx';
import {throwIf} from '@xh/hoist/utils/js';

@HoistModel
export class DimensionsEditorModel {

    @settable @observable.ref value = null;

    // Immutable properties
    maxDepth = null;
    dimensions = null;
    dimensionVals = null;
    initialValue = null;

    // Internal state
    @observable.ref pendingValue = null;

    //-------------------------
    // Dialog rendering
    //-------------------------
    @bindable isOpen = false;
    @bindable showAddSelect = false;

    @bindable isAdd;

    constructor({dimensions, initialValue, maxDepth = 4}) {
        this.maxDepth = maxDepth;

        this.dimensions = this.normalizeDimensions(dimensions);
        this.dimensionVals = keys(this.dimensions);
        this.pendingValue = this.initialValue = initialValue;
    }

    @action
    setPendingValue(val) {
        this.setIsAdd(!val);
        this.pendingValue = this.isAdd ? this.initialValue : val;
    }

    @action
    addPendingDim(dim, level) {
        const newValue = without(this.pendingValue, dim);               // Ensure the new dimension hasn't been selected at another level
        newValue[level] = dim;                                          // Insert the new dimension
        if (this.dimensions[dim].leaf) newValue.splice(level + 1);      // If it's a leaf dimension, remove any subordinate dimensions

        this.pendingValue = newValue;                                   // Update intermediate state
        this.setShowAddSelect(false);
    }

    @action
    removePendingDim(dim) {
        this.pendingValue = without(this.pendingValue, dim);
    }

    @action
    commitPendingValueAndClose() {
        this.setValue(this.pendingValue);
        this.setIsOpen(false);
    }

    // True if a leaf-level dim has been specified via the editor - any further child groupings
    // would be derivative at this point and should not be allowed by the UI.
    get leafInPending() {
        this.pendingValue.some(dim => this.dimensions[dim].leaf);
    }

    // Returns options passed to the select control at each level of the add menu.
    dimOptionsForLevel(level) {
        // Dimensions which do not appear in the add menu
        const remainingDims = difference(this.dimensionVals, this.pendingValue);
        // Dimensions subordinate to this one in the tree hierarchy
        const childDims = this.pendingValue.slice(level + 1) || [];
        return [...remainingDims, ...childDims].map(it => this.dimensions[it]);
    }


    //-------------------------
    // Value handling
    //-------------------------
    normalizeDimensions(dims) {
        dims = dims || [];
        const ret = {};
        dims.forEach(it => {
            const dim = this.createDimension(it);
            ret[dim.value] = dim;
        });
        return ret;
    }

    createDimension(src) {
        src = isString(src) ? {value: src} : src;

        throwIf(
            !src.hasOwnProperty('value'),
            "Dimensions provided as Objects must define a 'value' property."
        );
        return {label: src.value, leaf: false, ...src};
    }
}