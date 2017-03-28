# Bootstrap Multi Select for Mendix - Versiuon 2

This widget is a wrapper for the [Bootstrap MultiSelect plugin](https://github.com/davidstutz/bootstrap-multiselect)  allowing you to use a dropdown of checkboxes for your reference set.

## Contributing

For more information on contributing to this repository visit [Contributing to a GitHub repository](https://world.mendix.com/display/howto50/Contributing+to+a+GitHub+repository)!

## Typical usage scenario

Where you have a relatively small number of available options for a reference set selector, use this to quickly select the required options from within a dropdown.
 
# Configuration

## Data Source
- **Multi Select Source**: The reference set association, starting from the dataview object.
- **Display Template**: The template (treated as Plain Text) to use for in the dropdown. 
- **Template Attributes**: The mapping of attributes to variable names for replacement in 'Display Template'
- **Data constraint**: An XPath constraint, filtering the available objects that are displayed in the dropdown.
- **Sort order**: The attributes that the results should be sorted by.

## Display
- **Show Label**: Whether a label should be displayed for the dropdown.
- **Label Caption**: The text to be displayed in the label (only used if Show Label is set to Yes)
- **Form Orientation**: Horizontal or Vertical (should match the DataView's Form Orientation value)
- **Label Width**: A value between 1 and 11 that determines the width of the label. Will be reset to 1 or 11 if a value is selected that is outside these bounds. (only used if Show Label is set to Yes and Form Orientation is set to Horizontal).
- **Add Select All**: Whether the dropdown should be rendered with a 'Select All' option at the top, allowing you to select/deselect all displayed options.
- **Add Filter**: Whether the dropdown should be rendered with a search bar at the top, allowing you to filter the results.
- **Case Sensitive Filter**: If filter is enabled, whether the search is case sensitive or not.
- **Items to display**: The max number of items that will be displayed as a comma delimited string in the dropdown field before being replaced with the text 'n selected' (where n is the number of selected items).

## Events
- **On change**: The microflow that will be run when an item is checked or unchecked.
- **Show Progress Bar**: Whether to show a progress bar when executing the on change microflow.
- **Progress Message**: The message to show in the progress bar.


# Known Issues

See [here](https://github.com/AuraQ/BootstrapMultiSelectForMendix/issues) for all outstanding issues or to raise a new issue, enhancement etc.

# v2.0.0 Breaking changes:
- ‘Display attribute’ has been replaced with 'Display Template' and 'Template Attributes'.