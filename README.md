# Bootstrap Multi Select for Mendix

This widget is a wrapper for the [Bootstrap MultiSelect plugin](https://github.com/davidstutz/bootstrap-multiselect)  allowing you to use a dropdown of checkboxes for your reference set.

## Contributing

For more information on contributing to this repository visit [Contributing to a GitHub repository](https://world.mendix.com/display/howto50/Contributing+to+a+GitHub+repository)!

## Typical usage scenario

Where you have a relatively small number of available options for a reference set selector, use this to quickly select the required options from within a dropdown.
 
# Configuration


## Data Source
- Multi Select Source: The reference set association, starting from the dataview object.
- Display attribute: The attribute to use as the caption for the checkboxes displayed in the dropdown.
- Data constraint: An XPath constraint, filtering the available objects that are displayed in the dropdown.

## Display
- Show Label: Whether a label should be displayed for the dropdown.
- Label Caption: The text to be displayed in the label (only used if Show Label is set to Yes)
- Form Orientation: Horizontal or Vertical (should match the DataView's Form Orientation value)
- Label Width: A value between 1 and 11 that determines the width of the label. Will be reset to 1 or 11 if a value is selected that is outside these bounds. (only used if Show Label is set to Yes and Form Orientation is set to Horizontal)
- Add Select All: Whether the dropdown should be rendered with a 'Select All' option at the top, allowing you to select/deselect all displayed options.
- Items to display: The max number of items that will be displayed as a comma delimited string in the dropdown field before being replaced with the text 'n selected' (where n is the number of selected items).

## Events
- On change: The microflow that will be run when an item is checked or unchecked.
