jQuery-CPF-CNPJ-Validator-plugin
================================

Um plugin jQuery para validar CPF ou CNPJ, ou quem sabe os dois...

<!--
[![status](https://sourcegraph.com/api/repos/github.com/gmgomess/jQuery-CPF-CNPJ-Validator-plugin/.badges/status.png)](https://sourcegraph.com/github.com/gmgomess/jQuery-CPF-CNPJ-Validator-plugin)
[![library users](https://sourcegraph.com/api/repos/github.com/gmgomess/jQuery-CPF-CNPJ-Validator-plugin/.badges/library-users.png)](https://sourcegraph.com/github.com/gmgomess/jQuery-CPF-CNPJ-Validator-plugin)
[![views](https://sourcegraph.com/api/repos/github.com/gmgomess/jQuery-CPF-CNPJ-Validator-plugin/.counters/views.png)](https://sourcegraph.com/github.com/gmgomess/jQuery-CPF-CNPJ-Validator-plugin)-->

Indique o campo que deseja validar:

```js
$('.validar').cpfcnpj();</code>

```


##### Tipo a ser validado (CPF, CNPJ ou os dois)
Para definir o tipo de valor esperado: **validate** podendo ser **'cpf'**, **'cnpj'** ou **'cpfcnpj'** para os dois valores. Default: **'cpfcnpj'**


##### Máscara

Se desejar máscara no campo, apenas adicione ao **head** o [jQuery-Mask-Plugin](http://igorescobar.github.io/jQuery-Mask-Plugin/) e defina **mask: true**. Se o campo for do tipo **'cpfcnpj'** a mascara será definida conforme digitação do usuário. Default: **false**


##### Quando validar
Para definir em que evento deve acontecer a validação: **event** podendo ser qualquer evento jQuery, exemplo: **click**, **focusout** ou qualquer outro evento. Default: **focusout**


##### Qual elemento deve disparar a validação
Use **handler** podendo ser qualquer valor de um seletor jQuery, exemplo: **'#btn'** ou **'input'**, etc. Default: **o elemento a ser validado**


##### O que fazer se o valor for VÁLIDO?
Essa function será executada se o valor passar pela validação definida.
Defina uma function em:
**ifValid**. Passe um parâmetro para que seja recuperado o controle validado.


##### O que fazer se o valor for INVÁLIDO?
Essa function será executada se o valor NÃO passar pela validação definida. Passe um parâmetro para que seja recuperado o controle validado.
Defina uma function em:
**ifInvalid** podendo exibir um alert, definir o foco, o que quiser...


#### Exemplo:

```js
$(document).ready(function () {
	$('.validar').cpfcnpj({
		mask: true,
		validate: 'cpfcnpj',
		event: 'click',
		handler: '.btn',
		ifValid: function  (input) { input.removeClass("error"); },
		ifInvalid: (input) { input.addClass("error"); }
	});
});

```
