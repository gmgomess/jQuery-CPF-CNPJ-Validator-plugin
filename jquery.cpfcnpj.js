/*!
 * jQuery CPF/CNPJ Validator Plugin v1.1.0
 * Developed by: Guilherme Gomes (gmgomess@gmail.com)
 * Updated by: Erick Major dos Santos (erick.major@yahoo.com.br)
 * Date: 2017-09-18
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
            ifValid: null,
            ifInvalid: null
        }, options);

        if (settings.mask) {
            if (jQuery().mask == null) {
                settings.mask = false;
                console.log("jQuery mask not found.");
            }
            else {
                if (settings.validate == 'cpf') {
                    $(this).mask('000.000.000-00');
                }
                else if (settings.validate == 'cnpj') {
                    $(this).mask('00.000.000/0000-00');
                }
                else {
                    var ctrl = $(this);
                    var opt = {
                        onKeyPress: function (field) {
                            var masks = ['000.000.000-009', '00.000.000/0000-00'];
                            msk = (field.length > 14) ? masks[1] : masks[0];
                            ctrl.mask(msk, this);
                        }
                    };

                    $(this).mask('000.000.000-009', opt);
                }
            }
        }

        return this.each(function () {
            var valid = null;
            var control = $(this);

            $(document).on(settings.event, settings.handler,
                function () {
                    if(settings.mask == false) {
                        if (control.val().length == 11 || control.val().length == 14) {
                            if (settings.validate == 'cpf') {
                                valid = validate_cpf_without_accents(control.val());
                            }
                            else if (settings.validate == 'cnpj') {
                                valid = validate_cnpj_without_accents(control.val())
                            }
                            else if (settings.validate == 'cpfcnpj') {
                                if (validate_cpf_without_accents(control.val())) {
                                    valid = true;
                                    type = 'cpf';
                                }
                                else if (validate_cnpj_without_accents(control.val())) {
                                    valid = true;
                                    type = 'cnpj';
                                }
                                else valid = false;
                            }

                        }
                        else valid = false;
                    } else {
                        if (control.val().length == 14 || control.val().length == 18) {
                            if (settings.validate == 'cpf') {
                                valid = validate_cpf(control.val());
                            }
                            else if (settings.validate == 'cnpj') {
                                valid = validate_cnpj(control.val())
                            }
                            else if (settings.validate == 'cpfcnpj') {
                                if (validate_cpf(control.val())) {
                                    valid = true;
                                    type = 'cpf';
                                }
                                else if (validate_cnpj(control.val())) {
                                    valid = true;
                                    type = 'cnpj';
                                }
                                else valid = false;
                            }
                        }
                        else valid = false;
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
                });
        });
    }

    function validate_cnpj(val) {

        if (val.match(/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/) != null) {
            var val1 = val.substring(0, 2);
            var val2 = val.substring(3, 6);
            var val3 = val.substring(7, 10);
            var val4 = val.substring(11, 15);
            var val5 = val.substring(16, 18);
            return verify_cnpj_is_valid(
                // val1
                val.substring( 0,  2),
                // val2
                val.substring( 3,  6),
                // val3
                val.substring( 7, 10),
                // val4
                val.substring(11, 15),
                // val5
                val.substring(16, 18)
            );
        }
        return false;
    }

    function validate_cpf(val) {

        if (val.match(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/) != null) {
            return verify_cpf_is_valid(
                // val1
                val.substring( 0,  3),
                // val2
                val.substring( 4,  7),
                // val3
                val.substring( 8, 11),
                // val4
                val.substring(12, 14)
            );
        }

        return false;
    }

    function validate_cnpj_without_accents(val) {

        if (val.match(/^\d{14}$/) != null) {
            var val1 = val.substring(0, 2);
            var val2 = val.substring(2, 5);
            var val3 = val.substring(5, 8);
            var val4 = val.substring(8, 12);
            var val5 = val.substring(12, 14);

            return verify_cnpj_is_valid(
                // val1
                val.substring( 0,  2),
                // val2
                val.substring( 2,  5),
                // val3
                val.substring( 5,  8),
                // val4
                val.substring( 8, 12),
                // val5
                val.substring(12, 14)
            );
        }
        return false;
    }

    function validate_cpf_without_accents(val) {

        if (val.match(/^\d{11}$/) != null) {
            return verify_cpf_is_valid(
                // val1
                val.substring( 0,  3),
                // val2
                val.substring( 3,  6),
                // val3
                val.substring( 6,  9),
                // val4
                val.substring( 9, 11)
            );
        }

        return false;
    }

    function verify_cpf_is_valid(val1,val2,val3,val4) {
        var i;
        var number;
        var result = true;

        number = (val1 + val2 + val3 + val4);

        s = number;
        c = s.substr(0, 9);
        var dv = s.substr(9, 2);
        var d1 = 0;

        for (i = 0; i < 9; i++) {
            d1 += c.charAt(i) * (10 - i);
        }

        if (d1 == 0)
            result = false;

        d1 = 11 - (d1 % 11);
        if (d1 > 9) d1 = 0;

        if (dv.charAt(0) != d1)
            result = false;

        d1 *= 2;
        for (i = 0; i < 9; i++) {
            d1 += c.charAt(i) * (11 - i);
        }

        d1 = 11 - (d1 % 11);
        if (d1 > 9) d1 = 0;

        if (dv.charAt(1) != d1)
            result = false;

        return result;
    }

    function verify_cnpj_is_valid(val1,val2,val3,val4,val5) {
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
}(jQuery));
