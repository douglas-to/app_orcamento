
class Despesa{
	constructor(ano, mes, dia, tipo, descricao, valor){
		this.ano = ano;
		this.mes = mes;
		this.dia = dia;
		this.tipo = tipo;
		this.descricao = descricao;
		this.valor = valor;
	}

	validarDados(){
		for(let i in this){
			if(this[i] === undefined || this[i] === '' || this[i] === null){
				return false;
			}
		}

		return true;
	}
}

class Bd{
	constructor(){
		let id = localStorage.getItem("id");

		if(id === null){
			localStorage.setItem("id", 0);
		}
	}

	getProximoId(){
		let proximoId = localStorage.getItem("id");
		return parseInt(proximoId) + 1;
	}

	gravar(despesa){
		let id = this.getProximoId()

		localStorage.setItem(id, JSON.stringify(despesa));

		localStorage.setItem("id", id)
	}

	recuperarTodosRegistros(){

		let despesas = Array();
		let id = localStorage.getItem("id");

		for(let i = 1; i <= id; i++){

			let despesa = JSON.parse(localStorage.getItem(i));

			if(despesa === null){
				continue;
			}

			despesa.id = i;
			despesas.push(despesa);
		}

			return despesas;
	}

		pesquisar(despesa){
			let despesasFiltradas = Array(); 
			despesasFiltradas = this.recuperarTodosRegistros();

			if(despesa.ano != ""){
				despesasFiltradas = despesasFiltradas.filter(info => info.ano === despesa.ano)
			}

			if(despesa.mes != ""){
				despesasFiltradas = despesasFiltradas.filter(info => info.mes === despesa.mes)
			}

			if(despesa.dia != ""){
				despesasFiltradas = despesasFiltradas.filter(info => info.dia === despesa.dia)
			}

			if(despesa.tipo != ""){
				despesasFiltradas = despesasFiltradas.filter(info => info.tipo === despesa.tipo)
			}

			if(despesa.descricao != ""){
				despesasFiltradas = despesasFiltradas.filter(info => info.descricao === despesa.descricao)
			}

			if(despesa.valor != ""){
				despesasFiltradas = despesasFiltradas.filter(info => info.valor === despesa.valor)
			}

			return despesasFiltradas;
		}

		remover(id){
			localStorage.removeItem(id)
		}
}

let bd = new Bd()

function cadastrarDespesa(){
	let ano = document.getElementById("ano");
	let mes = document.getElementById("mes");
	let dia = document.getElementById("dia");
	let tipo = document.getElementById("tipo");
	let descricao = document.getElementById("descricao");
	let valor = document.getElementById("valor");
	let modalContainer = document.getElementById("modalContainer");
	let modalTitle = document.getElementById("exampleModalLabel");
	let modalTextBody = document.getElementById("modalTextBody");
	let btnClose = document.getElementById("btnClose");
	
	let despesa = new Despesa(
		ano.value, 
		mes.value, 
		dia.value, 
		tipo.value, 
		descricao.value, 
		valor.value
	)

	function modalSucess(){
		modalTitle.innerHTML = 'Sucesso ao gravar a despesa.';
		modalContainer.className = 'modal-header text-primary';
		modalTextBody.innerHTML = 'Para verificar as despesas gravadas, vá até a pagina consulta.';
		btnClose.innerHTML = 'Gravar mais uma despesa';
		btnClose.className = 'btn btn-primary';
	}

	function modalError(){
		modalTitle.innerHTML = 'Erro na gravação';
		modalContainer.className = 'modal-header text-danger'
		modalTextBody.innerHTML = 'Existem campos obrigatórios, que não foram preenchidos.';
		btnClose.innerHTML = 'Voltar e corrigir';
		btnClose.className = 'btn btn-danger';
	}

	if(despesa.validarDados()){
		bd.gravar(despesa);
		modalSucess();
		$('#modalDespesa').modal('show');
		ano.value = ""; 
		mes.value = ""; 
		dia.value = ""; 
		tipo.value = ""; 
		descricao.value = ""; 
		valor.value = "";
	}else{
		modalError();
		$('#modalDespesa').modal('show');
		
	}
	
}

function carregaListasDespesas(despesas = Array(), filtro = false){
	
	if(despesas.length === 0 && filtro === false){
		despesas = bd.recuperarTodosRegistros();
	}
	

	let listaDespesas = document.getElementById("listaDespesas");
	listaDespesas.innerHTML = "";

	despesas.forEach((despesa) => {
		let linha = listaDespesas.insertRow();

		linha.insertCell(0).innerHTML = `${despesa.dia}/${despesa.mes}/${despesa.ano}`;
		linha.insertCell(1).innerHTML = despesa.tipo;
		linha.insertCell(2).innerHTML = despesa.descricao;
		linha.insertCell(3).innerHTML = despesa.valor;
		let btn = document.createElement('button');
		btn.className = 'btn btn-danger';
		btn.innerHTML = '<i class="fa-regular fa-circle-xmark"></i>';
		btn.id = `id_despesa_${despesa.id}`;
		btn.onclick = function(){
			let id = this.id.replace('id_despesa_', '');
			bd.remover(id);
			window.location.reload()
		}
		
		linha.insertCell(4).append(btn);
		console.log(despesa)
	})
}

function pesquisarDespesa(){
	let filtroDespesa = new Despesa(
		ano.value, 
		mes.value, 
		dia.value, 
		tipo.value, 
		descricao.value, 
		valor.value
	)

	let despesas = Array();

	despesas = 	bd.pesquisar(filtroDespesa);

	carregaListasDespesas(despesas, true);
}

