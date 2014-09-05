(function() {

	var namespace = breelNS.getNamespace("generic.utils");

	if(!namespace.FormValidation) {

		var FormValidation = function FormValidation() {
			//LVNOTE: do nothing
		};
		
		namespace.FormValidation = FormValidation;

		FormValidation.formElementHasEmailNotDefault = function formElementHasEmailNotDefault(aElement, aDefaultValue) {

			var valid = FormValidation.formElementHasStringValueNotDefault(aElement, aDefaultValue);
			if (!valid) return false;
			else {
				var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,6})$/;
				var formValue = aElement.value;
				if (reg.test(formValue) == false)
					return false;
				else
					return true;
			}
		};

		FormValidation.formElementHasStringValueNotDefault = function formElementHasStringValueNotDefault(aElement, aDefaultValue) {
			if (!aElement) return false;
			var formValue;
			if (aElement.value) 
				formValue = aElement.value;
			else
				formValue = aElement.innerHTML;

			if (formValue && formValue != "" && formValue != aDefaultValue)
			{
				return true;
			} else {
				return false;
			}
		};

		FormValidation.checkIfRadioButtonIsChecked = function checkIfRadioButtonIsChecked(aElement) {
			if (!aElement) return false;
			return aElement.checked;
		};

	}

})();