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
 */
// {{{ Editar
/**
 * Objeto Editar
 * 
 * Coordena todo o fluxo do programa
 */
Editar = {
    // {{{ Editar.Add
    /**
     * Feriados a serem adicionados
     */
    Add: {
        // {{{ Editar.Add.add()
        /**
         * Adiciona uma linha à tabela
         */
        add: function(t)
        {
            Rules.add[t.toLowerCase()].push('', '', false, '', '');
            Editar.Add.render(t);
            Editar.Add.edit(t, $('e' + t).rows.length - 1, 0);
            Editar.editing.newRow = true;
        },
        // }}}
        // {{{ Editar.Add.del()
        /**
         * Apaga uma linha da tabela
         */
        del: function(t, r)
        {
            if (YesNo('Tem certeza de que deseja excluir o feriado "' + Rules.add[t.toLowerCase()][r * 5 + 3] + '" ?', 'Confirmação') == 6) {
                Rules.add[t.toLowerCase()].splice(r * 5, 5);
                Editar.save();
                Editar.Add.render(t);
                delete Editar.editing;
            }
        },
        // }}}
        // {{{ Editar.Add.edit()
        /**
         * Edita uma linha da tabela
         */
        edit: function(t, r, c)
        {
            var st, e, su, m, f;
            Editar.editing = {
                table: t,
                object: Editar.Add,
                row: r,
                cell: c,
                oldData: {
                    st: st = Rules.add[t.toLowerCase()][r * 5 + 0],
                    e : e  = Rules.add[t.toLowerCase()][r * 5 + 1],
                    su: su = Rules.add[t.toLowerCase()][r * 5 + 2],
                    m : m  = Rules.add[t.toLowerCase()][r * 5 + 3],
                    f : f  = Rules.add[t.toLowerCase()][r * 5 + 4]
                }
            }
            Editar.editing.data = Object.extend({}, Editar.editing.oldData);
            $($('e' + t).childNodes[r].childNodes[0]).update(new Element('input', {id: 'start', type: 'text', size: (t == 'Yearly' ? 5 : 10), maxLength: (t == 'Yearly' ? 5 : 10), value: st}))
                                                       .insert(' a ')
                                                       .insert(new Element('input', {id: 'end', type: 'text', size: (t == 'Yearly' ? 5 : 10), maxLength: (t == 'Yearly' ? 5 : 10), value: e}));
            $($('e' + t).childNodes[r].childNodes[1]).update(new Element('input', {id: 'motivo', type: 'text', size: 40, maxLength: 255, value: m}));
            $($('e' + t).childNodes[r].childNodes[2]).update(new Element('select', {id: 'susp'}).insert(new Element('option', {value: 'true', innerHTML: 'Sim'})).insert(new Element('option', {value: 'false', innerHTML: 'Não'})));
            $('susp').value = String(su);
            $($('e' + t).childNodes[r].childNodes[3]).update(new Element('input', {id: 'fundamento', type: 'text', size: 40, maxLength: 255, value: f}));
            var fields = $('e' + t).childNodes[r].childNodes[c].getElementsByTagName('input');
            if (fields.length > 0) {
                var field = $(fields[0]);
                field.select();
                field.focus();
            } else if ((fields = $('e' + t).childNodes[r].childNodes[c].getElementsByTagName('select')).length > 0) {
                var field = $(fields[0]);
                field.focus();
            }
        },
        // }}}
        // {{{ Editar.Add.insertRow()
        /**
         * Insere uma linha na tabela
         * 
         * @param Array Regras
         * @param string ID da tabela
         * @return void
         */
        insertRow: function(rules, table)
        {
            var arr = rules.slice();
            while (arr.length > 0) {
                var st = arr.shift();
                var e  = arr.shift();
                var su = arr.shift();
                var m  = arr.shift();
                var f  = arr.shift();
                var r = [st, m, su ? 'Sim' : 'Não', f ? f : '<br />'];
                if (e != st) {
                    r[0] += ' a ' + e;
                }
                var e = $($(table).insertRow());
                r.each(function(i, s)
                {
                    if (!isNaN(Number(i))) {
                        e.insertCell().innerHTML = s;
                    }
                });
                e.insert(new Element('th').update('Apagar'));
            }
        },
        // }}}
        // {{{ Editar.Add.order()
        /**
         * Ordena os feriados por data
         * @return boolean
         */
        order: function()
        {
            var a = [];
            while (Rules.add[Editar.editing.table.toLowerCase()].length > 0) {
                a.push(Rules.add[Editar.editing.table.toLowerCase()].splice(0, 5));
            }
            a.sort(function(i, j)
            {
                var is = new Date().fromString(i[0]).getTime();
                var ie = new Date().fromString(i[1]).getTime();
                var js = new Date().fromString(j[0]).getTime();
                var je = new Date().fromString(j[1]).getTime();
                if (is < js) {
                    return -1;
                } else  if (is == js) {
                    if (ie < je || (ie == je && i[3] < j[3])) {
                        return -1;
                    } else {
                        return 1;
                    }
                } else {
                    return 1;
                }
            });
            while (a.length > 0) {
                for (var i = 0; i < 5; i++) {
                    Rules.add[Editar.editing.table.toLowerCase()].push(a[0][i]);
                }
                a.splice(0,1);
            }
        },
        // }}}
        // {{{ Editar.Add.render()
        /**
         * Renderiza a tabela
         */
        render: function(t)
        {
            while ($('e' + t).childNodes.length > 0) {
                var child = $('e' + t).childNodes[0];
                $('e' + t).removeChild(child);
            }
            Editar.Add.insertRow(Rules.add[t.toLowerCase()], 'e' + t);
        },
        // }}}
        // {{{ Editar.Add.validate()
        /**
         * Valida os campos
         * @return boolean
         */
        validate: function()
        {
            var r = Editar.editing.row;
            var c = Editar.editing.cell;
            var st, e, su, m, f;
            Editar.editing.data = {
                st: st = $('start').value,
                e : e  = $('end').value,
                su: su = $('susp').value == 'true',
                m : m  = $('motivo').value,
                f : f  = $('fundamento').value
            }
            if (st != '' && !isNaN(st = new Date().fromString(st))) {
                st = Editar.editing.data.st = (Editar.editing.table == 'Yearly' ? st.format().substring(0, 5) : st.format());
            } else {
                alert('Data inválida\nA data não pode estar em branco e deve estar no formato "DD/MM' + (Editar.editing.table == 'Once' ? '/AAAA' : '') + '".');
                $('start').select();
                $('start').focus();
                return false;
            }
            if (e != '' && !isNaN(e = new Date().fromString(e))) {
                e = Editar.editing.data.e = (Editar.editing.table == 'Yearly' ? e.format().substring(0, 5) : e.format());
            } else {
                alert('Data inválida\nA data não pode estar em branco e deve estar no formato "DD/MM' + (Editar.editing.table == 'Once' ? '/AAAA' : '') + '".');
                $('end').select();
                $('end').focus();
                return false;
            }
            if (new Date().fromString(e) < new Date().fromString(st)) {
                alert('Data inválida\nA data final não pode ser menor que a inicial.');
                $('start').select();
                $('start').focus();
                return false;
            }
            if (m == '') {
                alert('Motivo inválido\nO motivo não pode estar em branco.');
                $('motivo').select();
                $('motivo').focus();
                return false;
            }
            Editar.editing.changed = [];
            Editar.editing.data.each(function(n, v)
            {
                if (v != Editar.editing.oldData[n]) {
                    Editar.editing.changed.push(n);
                }
            });
            if (Editar.editing.changed.length > 0 && YesNo('Confirmar alterações?', 'Confirmação') == 6) {
                Rules.add[Editar.editing.table.toLowerCase()].splice(r * 5, 5, st, e, su, m, f);
                Editar.Add.order();
                Editar.save();
            } else if (Editar.editing.newRow) {
                Rules.add[Editar.editing.table.toLowerCase()].splice(r * 5, 5);
            } else {
                Editar.Add.order();
            }
            Editar.Add.render(Editar.editing.table);
            delete Editar.editing;
            return true;
        }
        // }}}
    },
    // }}}
    // {{{ Editar.Remove
    /**
     * Feriados a serem adicionados
     */
    Remove: {
        // {{{ Editar.Remove.add()
        /**
         * Adiciona uma linha à tabela
         */
        add: function()
        {
            Rules.remove.push('', '');
            Editar.Remove.render();
            Editar.Remove.edit($('eRemove').rows.length - 1);
            Editar.editing.newRow = true;
        },
        // }}}
        // {{{ Editar.Remove.del()
        /**
         * Apaga uma linha da tabela
         */
        del: function(r)
        {
            if (YesNo('Tem certeza de que deseja excluir esta exceção?', 'Confirmação') == 6) {
                Rules.remove.splice(r * 2, 2);
                Editar.save();
                Editar.Remove.render();
                delete Editar.editing;
            }
        },
        // }}}
        // {{{ Editar.Remove.edit()
        /**
         * Edita uma linha da tabela
         */
        edit: function(r)
        {
            var st, e;
            Editar.editing = {
                table: 'Remove',
                object: Editar.Remove,
                row: r,
                cell: 0,
                oldData: {
                    st: st = Rules.remove[r * 2 + 0],
                    e : e  = Rules.remove[r * 2 + 1]
                }
            }
            Editar.editing.data = Object.extend({}, Editar.editing.oldData);
            $($('eRemove').childNodes[r].childNodes[0]).update(new Element('input', {id: 'start', type: 'text', size: 10, maxLength: 10, value: st}))
                                                       .insert(' a ')
                                                       .insert(new Element('input', {id: 'end', type: 'text', size: 10, maxLength: 10, value: e}));
            var field = $($('eRemove').childNodes[r].childNodes[0].getElementsByTagName('input')[0]);
            field.select();
            field.focus();
        },
        // }}}
        // {{{ Editar.Remove.insertRow()
        /**
         * Insere uma linha na tabela
         * 
         * @param Array Regras
         * @param string ID da tabela
         * @return void
         */
        insertRow: function(rules)
        {
            var arr = rules.slice();
            while (arr.length > 0) {
                var st = arr.shift();
                var e  = arr.shift();
                var r = [st];
                if (e != st) {
                    r[0] += ' a ' + e;
                }
                var e = $($('eRemove').insertRow());
                r.each(function(i, s)
                {
                    if (!isNaN(Number(i))) {
                        e.insertCell().innerHTML = s;
                    }
                });
                e.insert(new Element('th').update('Apagar'));
            }
        },
        // }}}
        // {{{ Editar.Remove.order()
        /**
         * Ordena os feriados por data
         * @return boolean
         */
        order: function()
        {
            var a = [];
            while (Rules.remove.length > 0) {
                a.push(Rules.remove.splice(0, 2));
            }
            a.sort(function(i, j)
            {
                var is = new Date().fromString(i[0]).getTime();
                var ie = new Date().fromString(i[1]).getTime();
                var js = new Date().fromString(j[0]).getTime();
                var je = new Date().fromString(j[1]).getTime();
                if (is < js) {
                    return -1;
                } else  if (is == js) {
                    if (ie < je) {
                        return -1;
                    } else if (ie == je) {
                        return 0;
                    } else {
                        return 1;
                    }
                } else {
                    return 1;
                }
            });
            while (a.length > 0) {
                for (var i = 0; i < 2; i++) {
                    Rules.remove.push(a[0][i]);
                }
                a.splice(0,1);
            }
        },
        // }}}
        // {{{ Editar.Remove.render()
        /**
         * Renderiza a tabela
         */
        render: function()
        {
            while ($('eRemove').childNodes.length > 0) {
                var child = $('eRemove').childNodes[0];
                $('eRemove').removeChild(child);
            }
            Editar.Remove.insertRow(Rules.remove);
        },
        // }}}
        // {{{ Editar.Remove.validate()
        /**
         * Valida os campos
         * @return boolean
         */
        validate: function()
        {
            var r = Editar.editing.row;
            var st, e;
            Editar.editing.data = {
                st: st = $('start').value,
                e : e  = $('end').value
            }
            if (st != '' && !isNaN(st = new Date().fromString(st))) {
                st = Editar.editing.data.st = st.format();
            } else {
                alert('Data inválida\nA data não pode estar em branco e deve estar no formato "DD/MM/AAAA".');
                $('start').select();
                $('start').focus();
                return false;
            }
            if (e != '' && !isNaN(e = new Date().fromString(e))) {
                e = Editar.editing.data.e = e.format();
            } else {
                alert('Data inválida\nA data não pode estar em branco e deve estar no formato "DD/MM/AAAA".');
                $('end').select();
                $('end').focus();
                return false;
            }
            if (new Date().fromString(e) < new Date().fromString(st)) {
                alert('Data inválida\nA data final não pode ser menor que a inicial.');
                $('start').select();
                $('start').focus();
                return false;
            }
            Editar.editing.changed = [];
            Editar.editing.data.each(function(n, v)
            {
                if (v != Editar.editing.oldData[n]) {
                    Editar.editing.changed.push(n);
                }
            });
            if (Editar.editing.changed.length > 0 && YesNo('Confirmar alterações?', 'Confirmação') == 6) {
                Rules.remove.splice(r * 2, 2, st, e);
                Editar.Remove.order();
                Editar.save();
            } else if (Editar.editing.newRow) {
                Rules.remove.splice(r * 2, 2);
            } else {
                Editar.Remove.order();
            }
            Editar.Remove.render();
            delete Editar.editing;
            return true;
        }
        // }}}
    },
    // }}}
    // {{{ Editar.Variable
    /**
     * Feriados móveis
     */
    Variable: {
        // {{{ Editar.Variable.edit()
        /**
         * Edita uma linha da tabela
         */
        edit: function(t, r, c)
        {
            var su, m, f;
            switch (r) {
                case 0:
                    m = 'carnaval';
                    break;
                case 1:
                    m = 'semana_santa';
                    break;
                case 2:
                    m = 'corpus_christi';
                    break;
            }
            Editar.editing = {
                table: t,
                object: Editar.Variable,
                row: r,
                cell: c,
                oldData: {
                    su: su = Rules[t.toLowerCase()][m][0],
                    m: m,
                    f : f  = Rules[t.toLowerCase()][m][1]
                }
            }
            Editar.editing.data = Object.extend({}, Editar.editing.oldData);
            $($('e' + t).childNodes[r].childNodes[2]).update(new Element('select', {id: 'susp'}).insert(new Element('option', {value: 'true', innerHTML: 'Sim'})).insert(new Element('option', {value: 'false', innerHTML: 'Não'})));
            $('susp').value = String(su);
            $($('e' + t).childNodes[r].childNodes[3]).update(new Element('input', {id: 'fundamento', type: 'text', size: 40, maxLength: 255, value: f}));
            var fields = $('e' + t).childNodes[r].childNodes[c].getElementsByTagName('input');
            if (fields.length > 0) {
                var field = $(fields[0]);
                field.select();
                field.focus();
            } else if ((fields = $('e' + t).childNodes[r].childNodes[c].getElementsByTagName('select')).length > 0) {
                var field = $(fields[0]);
                field.focus();
            }
        },
        // }}}
        // {{{ Editar.Variable.render()
        /**
         * Renderiza a tabela
         */
        render: function(t)
        {
            $('e' + t).childNodes[0].childNodes[2].innerHTML = Rules.variable.carnaval[0] ? 'Sim' : 'Não';
            $('e' + t).childNodes[0].childNodes[3].innerHTML = Rules.variable.carnaval[1] ? Rules.variable.carnaval[1] : '<br />';
            $('e' + t).childNodes[1].childNodes[2].innerHTML = Rules.variable.semana_santa[0] ? 'Sim' : 'Não';
            $('e' + t).childNodes[1].childNodes[3].innerHTML = Rules.variable.semana_santa[1] ? Rules.variable.semana_santa[1] : '<br />';
            $('e' + t).childNodes[2].childNodes[2].innerHTML = Rules.variable.corpus_christi[0] ? 'Sim' : 'Não';
            $('e' + t).childNodes[2].childNodes[3].innerHTML = Rules.variable.corpus_christi[1] ? Rules.variable.corpus_christi[1] : '<br />';
        },
        // }}}
        // {{{ Editar.Variable.validate()
        /**
         * Valida os campos
         * @return boolean
         */
        validate: function()
        {
            var r = Editar.editing.row;
            var c = Editar.editing.cell;
            var st, e, su, m, f;
            Editar.editing.data = {
                su: su = $('susp').value == 'true',
                m : Editar.editing.data.m,
                f : f  = $('fundamento').value
            }
            Editar.editing.changed = [];
            Editar.editing.data.each(function(n, v)
            {
                if (v != Editar.editing.oldData[n]) {
                    Editar.editing.changed.push(n);
                }
            });
            if (Editar.editing.changed.length > 0 && YesNo('Confirmar alterações?', 'Confirmação') == 6) {
                Rules.variable[Editar.editing.data.m] = [Editar.editing.data.su, Editar.editing.data.f];
                Editar.save();
            }
            Editar.Variable.render(Editar.editing.table);
            delete Editar.editing;
            return true;
        }
        // }}}
    },
    // }}}
    // {{{ Editar.init()
    /**
     * Função executada no início do programa
     */
    init: function()
    {
        Editar.Variable.render('Variable');
        Editar.Add.render('Yearly');
        Editar.Remove.render();
        Editar.Add.render('Once');
        document.body.onclick = Editar.onclick;
    },
    // }}}
    // {{{ Editar.onclick()
    /**
     * Função executada ao clicar em qualquer lugar da tela
     */
    onclick: function()
    {
        var e = $(window.event.srcElement);
        while (e.tagName.toLowerCase() != 'body') {
            switch (e.tagName.toLowerCase()) {
                case 'td':
                    var c = e.cellIndex;
                    break;
                case 'th':
                    var h = e.cellIndex;
                    break;
                case 'tr':
                    var r = e.sectionRowIndex;
                    break;
                case 'tbody':
                    var t = e.id.substring(1);
                    break;
                case 'tfoot':
                    var f = e.id.substring(1);
                    break;
                default:
                    break;
            }
            e = e.parentNode;
        }
        switch (t || f) {
            case 'Variable':
                var method = 'Variable';
                break;
            case 'Yearly':
            case 'Once':
                var method = 'Add';
                break;
            case 'Remove':
                var method = 'Remove';
                break;
            default:
                break;
        }
        if (Editar.editing && (null == t || Editar.editing.table != t || null == r || Editar.editing.row != r)) {
            /*
             * O clique não foi na linha atualmente sob edição
             */
            return Editar.editing.object.validate();
        } else if (Editar.editing && null != h && null != r && Editar.editing.row == r && null != t && Editar.editing.table == t) {
            /*
             * O clique foi na coluna "Apagar" da linha sob edição
             */
        } else if (Editar.editing) {
            /*
             * O clique foi na linha atualmente sob edição
             */
            return false;
        }
        if (null != t && null != r && null != c) {
            /*
             * O clique foi em uma determinada linha e coluna
             */
            if (method == 'Remove') {
                Editar.Remove.edit(r);
            } else if (method == 'Variable') {
                Editar.Variable.edit(t, r, c);
            } else {
                Editar.Add.edit(t, r, c);
            }
        } else if (null != t && null != r && null != h) {
            /*
             * O clique foi na coluna "Apagar"
             */
            if (method == 'Remove') {
                Editar.Remove.del(r);
            } else {
                Editar.Add.del(t, r);
            }
        } else if (null != f) {
            /*
             * O clique foi na linha "Adicionar"
             */
            if (method == 'Remove') {
                Editar.Remove.add();
            } else {
                Editar.Add.add(f);
            }
        }
    },
    // }}}
    // {{{ Editar.save()
    /**
     * Salva as regras em um arquivo
     * 
     * @return void
     */
    save: function()
    {
        oFSO = new ActiveXObject("Scripting.FileSystemObject");
        oFile = oFSO.openTextFile('programa/include/regras.js', 2, true, -1);
        oFile.write('Rules=' + Rules.toJSON());
        oFile.close();
        delete oFile;
        delete oFSO;
    }
    // }}}
}
// }}}
// vim:enc=utf-8:ts=4:sw=4:expandtab
