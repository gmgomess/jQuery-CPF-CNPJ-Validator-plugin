/*!
 * jQuery CPF/CNPJ Validator Plugin v1.1.4
 * Developed by: Guilherme Gomes (gmgomess@gmail.com)
 * Date: 2019-02-23 
 */
(function ($) {
    $.fn.cpfcnpj = function (options) {
        // Default settings
        var settings = $.extend({
            mask: false,
            validate: 'cpfcnpj',
            event: 'focusout',
            handler: $(this),
            validateOnlyFocus: false,
            ifValid: null,
            ifInvalid: null,
            returnType: null
        }, options);

        if (settings.mask) {
            if (jQuery().mask == null) {
                settings.mask = false;
                console.log("jQuery mask not found.");
            }
            else {
                var masks = ['000.000.000-009', '00.000.000/0000-00'];
                var ctrl = $(this);
                if (settings.validate == 'cpf') {
                    ctrl.mask(masks[0]);
                }
                else if (settings.validate == 'cnpj') {
                    ctrl.mask(masks[1]);
                }
                else {
                    var cpfCnpjMsk = function (val) {
                        return val.length === 0 || val.length >= 12 ? masks[1] : masks[0];
                    }

                    var opt = {
                        onChange: function (val, e, currentField) {
                            var field = $(currentField);
                            var value = field.cleanVal();
                            field.mask(cpfCnpjMsk(value), opt);
                        }
                    };
                    ctrl.mask(cpfCnpjMsk, opt);
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
                        returnType = null;

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
                                    returnType = 'cpf';
                                }
                                else if (validate_cnpj(value, settings.mask)) {
                                    valid = true;
                                    returnType = 'cnpj';
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
        val = val.replace(/[^\d]+/g, '');

        if (val == '') return false;

        if (val.length != 14)
            return false;

        // Elimina CNPJs invalidos conhecidos
        if (val == "00000000000000" ||
            val == "11111111111111" ||
            val == "22222222222222" ||
            val == "33333333333333" ||
            val == "44444444444444" ||
            val == "55555555555555" ||
            val == "66666666666666" ||
            val == "77777777777777" ||
            val == "88888888888888" ||
            val == "99999999999999")
            return false;

        // Valida DVs
        tamanho = val.length - 2
        numeros = val.substring(0, tamanho);
        digitos = val.substring(tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2)
                pos = 9;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(0))
            return false;

        tamanho = tamanho + 1;
        numeros = val.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2)
                pos = 9;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(1))
            return false;

        return true;
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
