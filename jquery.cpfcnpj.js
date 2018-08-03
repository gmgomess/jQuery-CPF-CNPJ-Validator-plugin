/*!
 * jQuery CPF/CNPJ Validator Plugin v1.1.3
 * Developed by: Guilherme Gomes (gmgomess@gmail.com)
 * Date: 2018-08-02
 */
(function ($) {
    var type = null;

    $.fn.cpfcnpj = function (options) {
        // Default settings
        var settings = $.extend({
            mask: false,
            validate: 'cpfcnpj',
            event: 'focusout',
            handler: $(this),
            validateOnlyFocus: false,
            ifValid: null,
            ifInvalid: null
        }, options);

        if (settings.mask) {
            if (jQuery().mask == null) {
                settings.mask = false;
                console.log("jQuery mask not found.");
            }
            else {
                var ctrl = $(this);
                if (settings.validate == 'cpf') {
                    ctrl.mask('000.000.000-00');
                }
                else if (settings.validate == 'cnpj') {
                    ctrl.mask('00.000.000/0000-00');
                }
                else {
                    var msk = '000.000.000-009';
                    var opt = {
                        onKeyPress: function (field) {
                            var masks = ['000.000.000-009', '00.000.000/0000-00'];
                            msk = (field.length > 14) ? masks[1] : masks[0];
                            ctrl.mask(msk, opt);
                        }
                    };
                    ctrl.mask(msk, opt);
                }
            }
        }

        return this.each(function () {
            var valid = null;
            var control = $(this);

            $(document).on(settings.event, settings.handler,
                function () {
                    if (!settings.validateOnlyFocus || settings.validateOnlyFocus && control.is(':focus')) {
                        var value = control.val();
                        var lgt = value.length;

                        valid = false;

                        if (lgt == 11 || lgt == 14 || lgt == 18) {
                            if (settings.validate == 'cpf') {
                                valid = validate_cpf(value, settings.mask);
                            }
                            else if (settings.validate == 'cnpj') {
                                valid = validate_cnpj(value, settings.mask)
                            }
                            else if (settings.validate == 'cpfcnpj') {
                                if (validate_cpf(value, settings.mask)) {
                                    valid = true;
                                    type = 'cpf';
                                }
                                else if (validate_cnpj(value, settings.mask)) {
                                    valid = true;
                                    type = 'cnpj';
                                }
                            }
                        }

                        if ($.isFunction(settings.ifValid)) {
                            if (valid != null && valid) {
                                if ($.isFunction(settings.ifValid)) {
                                    var callbacks = $.Callbacks();
                                    callbacks.add(settings.ifValid);
                                    callbacks.fire(control);
                                }
                            }
                            else if ($.isFunction(settings.ifInvalid)) {
                                settings.ifInvalid(control);
                            }
                        }
                    }
                });
        });
    }

    function validate_cnpj(val, msk) {
        msk = msk != undefined && msk;
        var regex = msk ? /^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/ : /^[0-9]{14}$/;
        var match = val.match(regex);
        if (match != null) {
            var val1 = "";
            var val2 = "";
            var val3 = "";
            var val4 = "";
            var val5 = "";

            if (msk) {
                val1 = match[0];
                val2 = match[1]
                val3 = match[2]
                val4 = match[3];
                val5 = match[4];
            }
            else {
                val1 = val.substring(0, 2);
                val2 = val.substring(2, 5);
                val3 = val.substring(5, 8);
                val4 = val.substring(8, 12);
                val5 = val.substring(12, 14);
            }

            var i;
            var number;
            var result = true;

            number = (val1 + val2 + val3 + val4 + val5);

            s = number;

            c = s.substr(0, 12);
            var dv = s.substr(12, 2);
            var d1 = 0;

            for (i = 0; i < 12; i++)
                d1 += c.charAt(11 - i) * (2 + (i % 8));

            if (d1 == 0)
                result = false;

            d1 = 11 - (d1 % 11);

            if (d1 > 9) d1 = 0;

            if (dv.charAt(0) != d1)
                result = false;

            d1 *= 2;
            for (i = 0; i < 12; i++) {
                d1 += c.charAt(11 - i) * (2 + ((i + 1) % 8));
            }

            d1 = 11 - (d1 % 11);
            if (d1 > 9) d1 = 0;

            if (dv.charAt(1) != d1)
                result = false;

            return result;
        }
        return false;
    }

    function validate_cpf(val, msk) {
        var regex = msk != undefined && msk ? /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/ : /^[0-9]{11}$/;

        if (val.match(regex) != null) {
            //check all same numbers
            if (val.match(/\b(.+).*(\1.*){10,}\b/g) != null)
                return false;

            var strCPF = val.replace(/\D/g, '');
            var sum;
            var rest;
            sum = 0;

            for (i = 1; i <= 9; i++)
                sum = sum + parseInt(strCPF.substring(i - 1, i)) * (11 - i);

            rest = (sum * 10) % 11;

            if ((rest == 10) || (rest == 11))
                rest = 0;

            if (rest != parseInt(strCPF.substring(9, 10)))
                return false;

            sum = 0;
            for (i = 1; i <= 10; i++)
                sum = sum + parseInt(strCPF.substring(i - 1, i)) * (12 - i);

            rest = (sum * 10) % 11;

            if ((rest == 10) || (rest == 11))
                rest = 0;
            if (rest != parseInt(strCPF.substring(10, 11)))
                return false;

            return true;
        }

        return false;
    }
}(jQuery));