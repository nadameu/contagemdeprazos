/*
 * Este script faz parte do programa "Contagem de Prazos".
 *
 * Copyright (C) 2008 Paulo Roberto Maurici Junior
 *
 * "Contagem de Prazos" é um software livre: você pode redistribui-lo e/ou modifi-
 * cá-lo sob os termos da Licença Pública Geral GNU conforme publicada pela Free
 * Software Foundation, tanto a versão 3 da Licença, ou (a seu critério) qualquer
 * outra versão mais recente.
 * 
 * "Contagem de Prazos" é distribuído na esperança de ser útil, mas SEM QUALQUER
 * GARANTIA; sem mesmo a garantia implícita de VALOR COMERCIAL ou ADEQUAÇÃO PARA UM
 * PROPÓSITO EM PARTICULAR. Veja a Licença Pública Geral GNU para mais detalhes.
 * 
 * Você deve ter recebido uma cópia da Licença Pública Geral GNU com este programa.
 * Se não, veja <http://www.gnu.org/licenses/>.
 *
 * Este script é baseado em parte no Prototype JavaScript framework, version 1.6.0.2
 *
 *     Prototype JavaScript framework, version 1.6.0.2
 *     (c) 2005-2008 Sam Stephenson
 *
 *     Prototype is freely distributable under the terms of an MIT-style license.
 *     For details, see the Prototype web site: http://www.prototypejs.org/
 */

/**
 * Cálculo de prazos
 * 
 * @author Paulo Roberto Maurici Junior
 * @email pmj@jfsc.gov.br
 * @version 4.0
 */
// {{{ $()
/**
 * Alias para document.getElementById()
 *
 * @param string ID do elemento
 * @return HTMLElement
 */
$ = function(element)
{
    if (typeof element == 'string') {
        element = document.getElementById(element);
    }
    if (!(element instanceof Element)) {
        Object.extend(element, Element.Methods);
    }
    return element;
}
// }}}
// {{{ Class
/**
 * Construtor de classes
 */
Class = {
    // {{{ create()
    /**
     * Cria uma nova classe
     *
     * @return Function
     */
    create: function(properties)
    {
        var ret = function()
        {
            this.__construct.apply(this, arguments);
        }
        ret.prototype = properties;
        return ret;
    }
    // }}}
}
// }}}
// {{{ Object.extend()
/**
 * Estende os métodos/propriedades de um objeto
 *
 * @param Object Objeto de destino
 * @param Object Objeto de origem
 * @return Object
 */
Object.extend = function(destination, source)
{
  for (var property in source) {
    destination[property] = source[property];
  }
  return destination;
}
// }}}
// {{{ Object
/*
 * Estende os métodos do objeto Object
 */
Object.extend(Object.prototype, {
    // {{{ each()
    /**
     * Executa uma função para cada elemento do objeto
     */
    each: function(f)
    {
        for (var n in this) {
            if (typeof this[n] != 'function') {
                f(n, this[n]);
            }
        }
    },
    // }}}
    // {{{ toJSON()
    /**
     * Transforma um objeto em JSON
     * 
     * @return String
     */
    toJSON: function()
    {
        var ret = [];
        for (n in this) {
            if (n != 'toJSON' && n != 'each') {
                ret.push('"' + n + '":' + this[n].toJSON());
            }
        }
        return '{' + ret.join(',') + '}';
    }
    // }}}
});
// }}}
// {{{ Boolean
/*
 * Estende os métodos do objeto Boolean
 */
Object.extend(Boolean.prototype, {
    // {{{ toJSON()
    /**
     * Transforma uma boolean em JSON
     * 
     * @return String
     */
    toJSON: function()
    {
        if (this == true)
            return 'true';
        else
            return 'false';
    }
    // }}}
});
// }}}
// {{{ Array
/*
 * Estende os métodos do objeto Array
 */
Object.extend(Array.prototype, {
    // {{{ Array.prototype.toJSON()
    /**
     * Transforma uma array em JSON
     * 
     * @return String
     */
    toJSON: function()
    {
        var ret = [];
        for (i = 0; i < this.length; i++) {
            ret.push(this[i].toJSON());
        }
        return '[' + ret.join(',') + ']';
    }
    // }}}
});
// }}}
// {{{ Number
/*
 * Estende os métodos do objeto Number
 */
Object.extend(Number.prototype, {
    // {{{ pad()
    /**
     * Adiciona zeros à frente do número
     *
     * @param int número de caracteres final (incluindo o número original)
     * @return string
     */
    pad: function(chars)
    {
        return '0'.times(chars - this.toString().length) + this.valueOf();
    },
    // }}}
    // {{{ toJSON()
    /**
     * Transforma um número em JSON
     * 
     * @return String
     */
    toJSON: function()
    {
        return this;
    }
    // }}}
});
// }}}
// {{{ Date
/*
 * Estende os métodos do objeto Date
 */
Object.extend(Date.prototype, {
    // {{{ fromString()
    /**
     * Cria uma data a partir de uma string
     *
     * @param string Data no formato dd/mm/yyyy
     * @return Date
     */
    fromString: function(sDate)
    {
        arrDate = sDate.split(/[\/.-]/);
        year = arrDate.length > 2 ? arrDate[2] : this.getFullYear();
        month = arrDate.length > 1 ? arrDate[1] - 1 : this.getMonth();
        day = arrDate.length > 0 ? arrDate[0] : this.getDate();
        myDate = new Date(year, month, day, 12, 0, 0, 0);
        if (myDate.getFullYear() < 1950) myDate.setYear(myDate.getFullYear() + 100);
        return myDate;
    },
    // }}}
    // {{{ format()
    /**
     * Retorna a data no formato dd/mm/yyyy
     *
     * @return string
     */
    format: function()
    {
        return this.getDate().pad(2) + '/' + (this.getMonth() + 1).pad(2) + '/' + this.getFullYear();
    },
    // }}}
    // {{{ getFullMonth()
    /**
     * Retorna o nome do mês por extenso
     *
     * @return string
     */
    getFullMonth: function()
    {
        arrMonths = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
        return arrMonths[this.getMonth()];
    },
    // }}}
    // {{{ next()
    /**
     * Retorna o próximo dia
     *
     * @return Date
     */
    next: function()
    {
        newDate = new Date(this);
        newDate.setDate(this.getDate() + 1);
        return newDate;
    }
    // }}}
});
// }}}
// {{{ String
/*
 * Estende os métodos do objeto String
 */
Object.extend(String.prototype, {
    // {{{ times()
    /**
     * Repete várias vezes a string
     *
     * @param int número de vezes a repetir
     * @return string
     */
    times: function(chars)
    {
        returnValue = '';
        for (i = 0; i < chars; i++) {
            returnValue += this.toString();
        }
        return returnValue;
    },
    // }}}
    // {{{ toJSON()
    /**
     * Transforma uma string em JSON
     * 
     * @return String
     */
    toJSON: function()
    {
        return '"' + this.replace(/"/g, '\\"') + '"';
    }
    // }}}
});
// }}}
// {{{ Element
/*
 * Elemento HTML
 */
Element = function(tagName, attributes)
{
    attributes = attributes || {}
    var element = document.createElement(tagName);
    Object.extend(element, attributes);
    return $(element);
};
// }}}
// {{{ Element.Methods
/**
 * Estende os métodos dos elementos HTML
 *
 * @usedby $
 */
Element.Methods = {
    // {{{ hide()
    /**
     * Esconde o elemento
     *
     * @return void
     */
    hide: function()
    {
        this.style.display = 'none';
    },
    // }}}
    // {{{ insert()
    insert: function(obj)
    {
        if (typeof obj == 'string') {
            obj = document.createTextNode(obj);
        }
        this.appendChild(obj);
        return this;
    },
    // }}}
    // {{{ show()
    /**
     * Mostra o elemento
     *
     * @return void
     */
    show: function()
    {
        this.style.display = '';
    },
    // }}}
    // {{{ update()
    update: function(obj)
    {
        this.innerHTML = '';
        return this.insert(obj);
    }
    // }}}
}
// }}}
// {{{ Function
/*
 * Estende os métodos do objeto Function
 */
Object.extend(Function.prototype, {
    // {{{ bind()
    /**
     * Permite utilizar uma função como handler de um evento
     *
     * Reporta-se ao objeto de origem
     * @param Object Objeto que será referido por "this" no escopo da função
     * @param mixed Os demais parâmetros são passados à função na hora da execução
     * @return Function
     */
    bind: function()
    {
        var __method = this;
        var args = Array.prototype.slice.call(arguments);
        var object = args.shift();
        return function()
        {
            return __method.apply(object, args);
        }
    },
    // }}}
    // {{{ bind()
    /**
     * Transforma a função em JSON
     */
    toJSON: Function.prototype.toString
    // }}}
});
// }}}
// {{{ Calendario
/**
 * Objeto calendário
 */
Calendario = Class.create({
    // {{{ __construct()
    /**
     * Inicializa a classe Calendario
     * 
     * @param Prazo Objeto que contém a contagem do prazo
     */
    __construct: function(prazo)
    {
        this.prazo = prazo;
        this.contagem = {};
        for (var j = 0; j < this.prazo.count.length; j++) {
            this.contagem[this.prazo.count[j].format()] = j;
        }
        this.show(this.prazo.count[0]);
    },
    // }}}
    // {{{ show()
    /**
     * Renderiza o calendário
     *
     * @param Date Mês a ser exibido
     * @return void
     */
    show: function(dtMonth)
    {
        dtMonth = new Date(dtMonth);
        /*
         * Atualiza o mês mostrado no calendário
         */
        $('oPreviousMonth').onclick = this.show.bind(this, new Date(dtMonth).setMonth(dtMonth.getMonth() - 1));
        setPopup($('oPreviousMonth'), 'Mês anterior (<kbd>Ctrl</kbd> + <kbd>&larr;</kbd>)');
        $('oMonth').innerHTML = dtMonth.getFullMonth() + ' ' + dtMonth.getFullYear();
        $('oNextMonth').onclick = this.show.bind(this, new Date(dtMonth).setMonth(dtMonth.getMonth() + 1));
        setPopup($('oNextMonth'), 'Próximo mês (<kbd>Ctrl</kbd> + <kbd>&rarr;</kbd>)');
        var obj = this;
        document.onkeyup = function()
        {
            if (window.event.ctrlKey) {
                switch (window.event.keyCode) {
                    case 37:
                        /*
                         * Seta à esquerda
                         */
                        obj.show(new Date(dtMonth).setMonth(dtMonth.getMonth() - 1));
                        break;
                    case 39:
                        /*
                         * Seta à direita
                         */
                        obj.show(new Date(dtMonth).setMonth(dtMonth.getMonth() + 1));
                        break;
                    case 38:
                        /*
                         * Seta acima
                         */
                        obj.show(obj.prazo.count[0]);
                        break;
                    case 40:
                        /*
                         * Seta abaixo
                         */
                        obj.show(obj.prazo.count[obj.prazo.days]);
                        break;
                    default:
                        break;
                }
            }
        }
        /*
         * Atualiza os botões "Ir para"
         */
        $('oGoto').innerHTML = this.prazo.count[0].format();
        $('oGoto').onclick = this.show.bind(this, this.prazo.count[0]);
        setPopup($('oGoto'), 'Data da realização do ato (<kbd>Ctrl</kbd> + <kbd>&uarr;</kbd>)');
        $('oGotoLast').innerHTML = this.prazo.count[this.prazo.days].format();
        $('oGotoLast').onclick = this.show.bind(this, this.prazo.count[this.prazo.days]);
        setPopup($('oGotoLast'), 'Último dia da contagem (<kbd>Ctrl</kbd> + <kbd>&darr;</kbd>)');
        $('oGotoTransito').innerHTML = this.prazo.count[this.prazo.days + 1].format();
        $('oGotoTransito').onclick = this.show.bind(this, this.prazo.count[this.prazo.days + 1]);
        setPopup($('oGotoTransito'), 'Data do trânsito, se for o caso');
        /*
         * Apaga o calendário atual
         */
        for(i = $('oCalendar').rows.length - 1; i >= 0; i--) {
            $('oCalendar').deleteRow(i);
        }
        /*
         * Primeiro dia do mês
         */
        dtFirst = new Date(dtMonth.getFullYear(), dtMonth.getMonth(), 1, 0, 0, 0, 0);
        /*
         * Último dia do mês
         */
        dtLast = new Date(dtMonth.getFullYear(), dtMonth.getMonth() + 1, 0, 0, 0, 0, 0);
        /*
         * Renderiza os dias antes do início do mês
         */
        oRow = document.createElement('tr');
        for(i = 0; i < dtFirst.getDay(); i++) {
            oCell = document.createElement('td');
            oRow.appendChild(oCell);
        }
        /*
         * Renderiza os dias do mês
         */
        for(var i = 1; i <= dtLast.getDate(); i++) {
            dtCurr = new Date(dtFirst.getFullYear(), dtFirst.getMonth(), i, 0, 0, 0, 0);
            oCell = document.createElement('td');
            oCell.innerHTML = i;
            /*
             * Determina a decoração do dia
             */
            if (this.prazo.isFeriado(dtCurr)) {
                oCell.className = 'feriado';
                if(feriado = this.prazo.feriados[dtCurr.getFullYear()][dtCurr.format()]) {
                    setPopup(oCell, feriado.toString());
                    if (feriado.suspenso) {
                        oCell.className = 'suspensao';
                    }
                }
            }
            if (dtCurr.format() in this.contagem) {
                if (this.contagem[dtCurr.format()] == 0) {
                    oCell.className = 'first';
                    setPopup(oCell, 'Dia em que foi (ou presumiu-se) realizado o ato');
                } else if (this.contagem[dtCurr.format()] == this.prazo.days) {
                    oCell.className = 'last';
                    setPopup(oCell, 'Último dia da contagem');
                } else if (this.contagem[dtCurr.format()] == (this.prazo.days + 1)) {
                    oCell.className = 'transito';
                    setPopup(oCell, 'Data do trânsito, se for o caso');
                } else {
                    oCell.className = 'count';
                    setPopup(oCell, this.contagem[dtCurr.format()] + 'º dia da contagem');
                }
            }
            oRow.appendChild(oCell);
            /*
             * Cria uma nova linha
             */
            if ((i + dtFirst.getDay()) % 7 == 0) {
                $('oCalendar').appendChild(oRow);
                oRow = document.createElement('tr');
            }
        }
        $('oCalendar').appendChild(oRow);
        $('result').show();
    }
    // }}}
});
// }}}
// {{{ onBoletimChanged()
/**
 * Função chamada quando o campo boletim é alterado
 *
 * @return void
 */
onBoletimChanged = function()
{
    if ($('result').style.display != 'none') {
        $('oCalcular').onclick();
   }
}
// }}}
// {{{ onDateBlur()
/**
 * Função chamada quando a data é alterada
 *
 * @return void
 */
onDateBlur = function()
{
    dtDate = new Date().fromString(this.value);
    /*
     * Data da mudança da contagem de prazo - Lei 11.419/06 - 20/mar/2007
     */
    dtMuda = new Date().fromString('20/03/2007');
    if (dtDate > dtMuda) {
        $('oBoletim').disabled = false;
        $('lblBoletim').className = '';
    } else {
        $('oBoletim').checked = false;
        $('oBoletim').disabled = true;
        $('lblBoletim').className = 'disabled';
    }
    this.value = dtDate.format();
}
// }}}
// {{{ onDateKeyUp()
/**
 * Função chamada quando é pressionada uma tecla no campo data
 *
 * @return void
 */
onDateKeyUp = function()
{
    if (event.keyCode == 13) {
        $('oDays').focus();
    } else if (event.keyCode == 9) {
    } else {
        $('result').hide();
    }
}
// }}}
// {{{ onDaysBlur()
/**
 * Função chamada quando o campo "dias" é alterado
 *
 * @return void
 */
onDaysBlur = function()
{
    this.value = Math.floor(Number(this.value));
}
// }}}
// {{{ onDaysKeyUp()
/**
 * Função chamada quando é pressionada uma tecla no campo dias
 *
 * @return void
 */
onDaysKeyUp = function()
{
    if (event.keyCode == 13) {
        $('oCalcular').onclick();
        $('oDate').focus();
    } else if (event.keyCode == 9) {
    } else {
        $('result').hide();
    }
}
// }}}
// {{{ Parcelamento
/**
 * Classe parcelamento
 */
Parcelamento = Class.create({
    // {{{ __construct()
    /**
     * Inicializa a classe
     */
    __construct: function()
    {
        sParcFirst = window.prompt('Data da 1ª Parcela:', new Date().format());
        if (sParcFirst) {
            dtParcFirst = new Date().fromString(sParcFirst);
            dMonths = window.prompt('Data da 1ª Parcela:' + dtParcFirst.format() + '\nNº de meses:', 1);
            dMonths = Math.floor(Number(dMonths));
            if (dMonths > 0) {
                dtParcLast = new Date(dtParcFirst);
                dtParcLast.setMonth(dtParcFirst.getMonth() + dMonths - 1);
                window.clipboardData.setData('text', dtParcLast.format());
                window.alert('CÁLCULO DE PARCELAMENTO\n\nData da primeira parcela: ' + dtParcFirst.format() + '\nNúmero de parcelas: ' + dMonths + '\nData da última parcela: ' + dtParcLast.format() + '\n\nA DATA DA ÚLTIMA PARCELA FOI COPIADA,\nPODENDO SER COLADA NO WORD');
            }
        }
    }
    // }}}
});
// }}}
// {{{ popdown()
/**
 * Retira o aviso junto ao mouse
 *
 * @return void
 */
popdown = function()
{
    $('popup').hide();
}
// }}}
// {{{ popmove()
/**
 * Atualiza a posição do aviso junto ao mouse
 *
 * @return void
 */
popmove = function()
{
    $('popup').style.top = event.y + 20 + 'px';
    $('popup').style.left = event.x + 10 + 'px';
}
// }}}
// {{{ popup()
/**
 * Mostra um aviso junto ao mouse
 *
 * @return void
 */
popup = function(sAviso)
{
    $('popup').style.display = 'block';
    $('popup').innerHTML = sAviso;
}
// }}}
// {{{ Aviso
/**
 * Classe Aviso
 */
Aviso = Class.create({
    // {{{ Variáveis
    /**
     * Início da suspensão
     *
     * @var Date
     */
    start: new Date(),
    /**
     * Final da suspensão
     *
     * @var Date
     */
    end: new Date(),
    /**
     * Texto do aviso
     *
     * @var String
     */
    texto: '',    
    // }}}
    // {{{ __construct()
    /**
     * Inicializa a classe
     *
     * @param Date Início da suspensão
     * @param String Texto do aviso
     */
    __construct: function(start, texto)
    {
        this.start = start;
        this.end = start;
        this.texto = texto;
    },
    // }}}
    // {{{ toString()
    /**
     * Retorna uma string descrevendo o aviso
     *
     * @return String
     */
    toString: function()
    {
        start = this.start.format().split('/');
        end = this.end.format().split('/');
        if (start[2] == end[2]) {
            start.pop();
            if (start[1] == end[1]) {
                start.pop();
                if (start[0] == end[0]) {
                    start.pop();
                }
            }
        }
        var result = [start.join('/'), end.join('/')];
        if (result[0].length == 0) {
            result.shift();
        }
        return result.join(' a ') + ' - ' + this.texto;
    }
    // }}}
});
// }}}
// {{{ Feriado
/**
 * Classe Feriado
 */
Feriado = Class.create({
    // {{{ Variáveis
    /**
     * @var Boolean Indica se o prazo é suspenso
     */
    suspenso: false,
    /**
     * @var String Motivo do feriado
     */
    motivo: '',
    /**
     * @var String Fundamento jurídico (em caso de suspensão)
     */
    fundamento: '',
    // }}}
    // {{{ __construct()
    /**
     * Inicializa a classe
     *
     * @param Object Opções a serem alteradas
     */
    __construct: function(options)
    {
        for (n in options) {
            this[n] = options[n];
        }
    },
    // }}}
    // {{{ toString()
    /**
     * Retorna uma string contendo a descrição do feriado
     *
     * @return String
     */
    toString: function()
    {
        if (this.fundamento !== '') {
            return this.motivo + ' - ' + this.fundamento;
        } else {
            return this.motivo;
        }
    }
    // }}}
});
// }}}
// {{{ Prazo
/**
 * Classe prazo
 */
Prazo = Class.create({
    // {{{ __construct()
    /**
     * Inicializa a classe
     */
    __construct: function()
    {
        this.start = new Date().fromString($('oDate').value);
        this.days = Number($('oDays').value);
        this.feriados = {};
        this.count = [];
        this.avisos = [];
        this.catchSuspensoes = true;
        this.doCount();
        this.catchSuspensoes = false;
        if (this.avisos.length) {
            alert('ATENÇÃO: CERTIFICAR SUSPENSÃO DE PRAZOS\n\n' + this.avisos.join('\n'));
        }
        new Calendario(this);
    },
    // }}}
    // {{{ addAviso()
    /**
     * Adiciona um aviso de suspensão
     *
     * @param Date Data a ser exibida com aviso
     * @return void
     */
    addAviso: function(data)
    {
        last = this.avisos[this.avisos.length - 1];
        ano = data.getFullYear();
        feriado = this.feriados[ano][data.format()];
        texto = feriado.toString();
        if (last && last.texto == texto) {
            last.end = data;
        } else {
            aviso = new Aviso(data, texto);
            this.avisos.push(aviso);
        }
    },
    // }}}
    // {{{ addFeriado()
    /**
     * Adiciona um feriado à lista
     *
     * O primeiro parâmetro (ano) deve ser informado apenas uma vez.
     * Já os demais podem ser inseridos quantas vezes necessário para
     * adicionar todos os feriados.
     *
     * @param int Ano a ser adicionado
     *
     * @param String Data inicial do feriado no formato dd/mm/yyyy
     * @param String Data final do feriado no formato dd/mm/yyyy
     * @param Boolean Prazo suspenso
     * @param String Motivo do feriado
     * @param String Fundamento jurídico do feriado
     *
     * @return void
     */
    addFeriado: function()
    {
        var args = Array.prototype.slice.call(arguments);
        ano = args.shift();
        while (args.length > 0) {
            start = args.shift();
            end = args.shift();
            suspenso = args.shift();
            motivo = args.shift();
            fundamento = args.shift();
            if (start.split('/').length == 2) {
                /*
                 * Regra aplica-se a todos os anos
                 * Adiciona ao fim da lista com o ano selecionado
                 */
                args.push(start + '/' + ano, end + '/' + ano, suspenso, motivo, fundamento);
            } else if (start.split('/')[2] == ano) {
                /*
                 * Feriado encontra-se no ano atual
                 */
                if (!(ano in this.feriados)) {
                    this.feriados[ano] = [];
                }
                for (var curr = new Date().fromString(start), last = new Date().fromString(end); curr <= last; curr = curr.next()) {
                    this.feriados[ano][curr.format()] = new Feriado({ suspenso: suspenso, motivo: motivo, fundamento: fundamento });
                }
            }
        }
    },
    // }}}
    // {{{ addFeriadosMoveis()
    /**
     * Adiciona os feriados móveis à lista (Carnaval, Semana Santa e Corpus Christi)
     *
     * @param int Ano a ser adicionado
     * @return void
     */
    addFeriadosMoveis: function(ano)
    {
        if (ano >= 1900 && ano <= 2099) {
            var dX = 24, dY = 5, dA = ano % 19, dB = ano % 4, dC = ano % 7, dD = ((19 * dA) + dX) % 30, dE = (((2 * dB) + (4 * dC) + (6 * dD) + dY)) % 7;
            if (dD + dE < 10) {
                iDay = dD + dE + 22;
                iMonth = 2; // Março
            } else {
                iDay = dD + dE - 9;
                iMonth = 3; // Abril
            }
            if (iDay == 26 && iMonth == 3) iDay = 19;
            if (iDay == 25 && iMonth == 3 && dD == 28 && dA > 10) iDay = 18;
            /*
             * Cadastro do feriado de Carnaval (segunda e terça-feira)
             */
            dtStart = new Date(ano, iMonth, iDay - 48);
            dtEnd = new Date(ano, iMonth, iDay - 47);
            this.addFeriado(ano, dtStart.format(), dtEnd.format(), Rules.variable.carnaval[0], 'Carnaval', Rules.variable.carnaval[1]);
            /*
             * Cadastro da Semana Santa (quarta-feira a sexta-feira Santa)
             */
            dtStart = new Date(ano, iMonth, iDay - 4);
            dtEnd = new Date(ano, iMonth, iDay - 2);
            this.addFeriado(ano, dtStart.format(), dtEnd.format(), Rules.variable.semana_santa[0], 'Semana Santa', Rules.variable.semana_santa[1]);
            /*
             * Cadastro do feriado de Corpus Christi (quinta-feira)
             */
            dtFeriado = new Date(ano, iMonth, iDay + 60);
            this.addFeriado(ano, dtFeriado.format(), dtFeriado.format(), Rules.variable.corpus_christi[0], 'Corpus Christi', Rules.variable.corpus_christi[1]);
        }
    },
    // }}}
    // {{{ checkFeriados()
    /**
     * Verifica se o ano está na lista de feriados. Se não, o adiciona.
     *
     * @param int Ano a ser verificado
     * @return void
     */
    checkFeriados: function(ano)
    {
        if(!(ano in this.feriados)) {
            this.addFeriadosMoveis(ano);
            this.addFeriado.apply(this, [ano].concat(Rules.add.yearly.slice(0)));
            this.removeFeriado.apply(this, [ano].concat(Rules.remove.slice(0)));
            this.addFeriado.apply(this, [ano].concat(Rules.add.once.slice(0)));
        }
    },
    // }}}
    // {{{ doCount()
    /**
     * Realiza a contagem do prazo
     *
     * @return void
     */
    doCount: function()
    {
        currDate = this.start;
        for (var curr = 0; curr <= (this.days + 1); curr++) {
            if (curr == 0) {
                /*
                 * Data da realização do ato
                 */
                if ($('oEproc').checked) {
                    for (var i = 0; i < 10; ++i) {
                        /*
                         * Caso a data seja a da intimação eletrônica
                         * expedida no e-Proc, abre automaticamente
                         * no décimo dia corrido
                         */
                        currDate = currDate.next();
                    }
                }
                while (this.isFeriado(currDate)) {
                    /*
                     * Ato realizado em feriado, presume-se no próximo dia útil
                     */
                    currDate = currDate.next();
                }
                if ($('oBoletim').checked) {
                    do {
                        /*
                         * Caso a data seja a da disponibilização do
                         * boletim no edital eletrônico, presume-se
                         * publicado no próximo dia útil
                         */
                        currDate = currDate.next();
                    } while (this.isFeriado(currDate));
                }
            } else if (curr == 1) {
                /*
                 * Primeiro dia do prazo
                 */
                do {
                    currDate = currDate.next();
                    /*
                     * Não pode ser feriado
                     */
                } while (this.isFeriado(currDate));
            } else if (curr == this.days) {
                /*
                 * Último dia do prazo
                 */
                do {
                    currDate = currDate.next();
                    /*
                     * Não pode ser feriado
                     */
                } while (this.isFeriado(currDate));
            } else if (curr == (this.days + 1)) {
                /*
                 * Trânsito em julgado
                 */
                do {
                    currDate = currDate.next();
                    /*
                     * Não pode ser feriado
                     */
                } while (this.isFeriado(currDate));
            } else {
                /*
                 * Demais dias da contagem
                 */
                currDate = currDate.next();
                if (this.isSuspenso(currDate)) {
                    /*
                     * Prazo suspenso
                     */
                    while (this.isFeriado(currDate)) {
                        /*
                         * Só começa a contar novamente no próximo dia útil
                         */
                        currDate = currDate.next();
                    }
                }
            }
            this.count[curr] = currDate;
        }
    },
    // }}}
    // {{{ isFeriado()
    /**
     * Informa se o dia é feriado
     *
     * Verifica primeiro se os feriados daquele ano estão cadastrados
     * chamando a função checkFeriados()
     *
     * @param Date Data a ser verificada
     * @return Boolean
     */
    isFeriado: function(data)
    {
        var ano = data.getFullYear();
        this.checkFeriados(ano);
        if (this.catchSuspensoes && this.isSuspenso(data)) {
            this.addAviso(data);
        }
        myData = data.format();
        return (myData in this.feriados[ano]) || data.getDay() % 6 == 0;
    },
    // }}}
    // {{{ isSuspenso()
    /**
     * Informa se há suspensão no dia
     *
     * Verifica primeiro se os feriados daquele ano estão cadastrados
     * chamando a função checkFeriados()
     *
     * @param Date Data a ser verificada
     * @return Boolean
     */
    isSuspenso: function(data)
    {
        var ano = data.getFullYear();
        this.checkFeriados(ano);
        data = data.format();
        return (data in this.feriados[ano]) && this.feriados[ano][data].suspenso;
    },
    // }}}
    // {{{ removeFeriado()
    /**
     * Remove um feriado da lista
     *
     * Os parâmetros podem ser repetidos tantas vezes quanto
     * necessário para remover todos os feriados
     *
     * @param String Data inicial no formato dd/mm/yyyy
     * @param String Data final no formado dd/mm/yyyy
     *
     * @return void
     */
    removeFeriado: function(start, end)
    {
        var args = Array.prototype.slice.call(arguments);
        ano = args.shift();
        while (args.length > 0) {
            start = args.shift();
            end = args.shift();
            if (start.split('/')[2] == ano) {
                for (var curr = new Date().fromString(start), last = new Date().fromString(end); curr <= last; curr = curr.next()) {
                    var feriado = this.feriados[ano][curr.format()];
                    if (typeof feriado == 'object' && feriado instanceof Feriado) {
                        delete this.feriados[ano][curr.format()];
                    }
                }
            }
        }
    }
    // }}}
});
// }}}
// {{{ setPopup()
/**
 * Cria os handlers para os avisos do mouse
 *
 * @return void
 */
setPopup = function(oElement, sAviso)
{
    oElement.onmouseover = function() { popup(sAviso); }
    oElement.onmouseout = popdown;
    oElement.onmousemove = popmove;
}
// }}}
/*
 * Chama o script de inicialização
 */
init = function()
{
        window.resizeTo(792,520);
        $('oDate').value = new Date().format();
        $('oDate').onfocus = function() { this.select(); }
        $('oDate').onblur = onDateBlur;
        $('oDate').onkeyup = onDateKeyUp;
        $('oComum').onclick = onBoletimChanged;
        $('oBoletim').onclick = onBoletimChanged;
        $('oEproc').onclick = onBoletimChanged;
        $('oDays').value = 10;
        $('oDays').onblur = onDaysBlur;
        $('oDays').onkeyup = onDaysKeyUp;
        $('oDays').onfocus = function() { this.select(); };
        $('oCalcular').onclick = function() { window._prazo = new Prazo(); }
        $('oParcelamento').onclick = function() { window._parcelamento = new Parcelamento };
        $('oDate').focus();
        $('oDate').select();
        setPopup($('oParcelamento'), 'Calcula a data da última parcela baseado no vencimento da primeira e no número de prestações (<kbd>Alt</kbd> + <kbd>P</kbd>)');
        setPopup($('oDate'), 'Data em que foi realizado o ato que deu início à contagem (<kbd>Alt</kbd> + <kbd>D</kbd>)');
        var avisoComum = 'Selecione para casos de intimações comuns &mdash; mandado, carta, etc. (<kbd>Alt</kbd> + <kbd>O</kbd>)';
        setPopup($('oComum'), avisoComum);
        setPopup($('lblComum'), avisoComum);
        var avisoBoletim = 'Selecione caso a data informada seja a da disponibilização do boletim no Diário Eletrônico (presume-se que a publicação se deu no dia útil seguinte &mdash; art. 4º, § 3º da Lei nº. 11.419/06) (<kbd>Alt</kbd> + <kbd>B</kbd>)';
        setPopup($('oBoletim'), avisoBoletim);
        setPopup($('lblBoletim'), avisoBoletim);
        var avisoEproc = 'Selecione caso a data informada seja a da intimação eletrônica expedida no e-Proc (abrirá em 10 dias corridos caso não seja feita manualmente &mdash; art. 5º, § 3º da Lei nº. 11.419/06) (<kbd>Alt</kbd> + <kbd>E</kbd>)'
        setPopup($('oEproc'), avisoEproc);
        setPopup($('lblEproc'), avisoEproc);
        setPopup($('oDays'), 'Número de dias do prazo (<kbd>Alt</kbd> + <kbd>C</kbd>)');
        setPopup($('oCalcular'), 'Efetua o cálculo do prazo (<kbd>Enter</kbd>)');
}
window.onresize = function()
{
}
// vim:enc=utf-8:ts=4:sw=4:expandtab
