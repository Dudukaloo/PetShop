const API_URL = 'http://localhost:3000/agendamentos';

$(document).ready(function () {
    
    // Carrega a lista ao abrir a página
    carregarAgendamentos();

    // Enviar formulário (POST)
    $('#formAgendamento').submit(function (event) {
        event.preventDefault();

        const novoAgendamento = {
            nomePet: $('#nomePet').val(),
            tipo: $('#tipo').val(),
            servico: $('#servico').val(),
            observacoes: $('#observacoes').val()
        };

        $.ajax({
            url: API_URL,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(novoAgendamento),
            success: function (resposta) {
                exibirAlerta('Serviço agendado com sucesso!', 'success');
                $('#formAgendamento')[0].reset();
                carregarAgendamentos();
            },
            error: function (xhr) {
                let msg = 'Erro ao realizar agendamento.';
                if (xhr.responseJSON && xhr.responseJSON.erro) {
                    msg = xhr.responseJSON.erro;
                }
                exibirAlerta(msg, 'danger');
            }
        });
    });

    // Botão de atualizar
    $('#btnAtualizar').click(function () {
        carregarAgendamentos();
    });
});

// Função para buscar agendamentos (GET)
function carregarAgendamentos() {
    $.ajax({
        url: API_URL,
        type: 'GET',
        dataType: 'json',
        success: function (agendamentos) {
            const tabela = $('#tabelaAgendamentos');
            tabela.empty();

            if (agendamentos.length === 0) {
                tabela.append(`
                    <tr>
                        <td colspan="4" class="text-center text-muted py-4">Nenhum agendamento encontrado no momento.</td>
                    </tr>
                `);
                return;
            }

            agendamentos.forEach(function (item) {
                const icone = item.tipo.toLowerCase() === 'gato' ? '🐱 Gato' : '🐶 Cachorro';
                
                tabela.append(`
                    <tr>
                        <td class="fw-bold text-primary">${item.nomePet}</td>
                        <td><span class="badge bg-light text-dark fs-6">${icone}</span></td>
                        <td><span class="badge bg-info text-dark fs-6">${item.servico}</span></td>
                        <td class="text-secondary small">${item.observacoes}</td>
                    </tr>
                `);
            });
        },
        error: function () {
            exibirAlerta('Não foi possível conectar com a API do Pet-Shop67. Verifique se o Node.js está rodando!', 'danger');
        }
    });
}

// Alertas na tela
function exibirAlerta(mensagem, tipo) {
    const alertaHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
            ${mensagem}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    
    $('#areaAlertas').html(alertaHTML);

    setTimeout(function () {
        $('.alert').alert('close');
    }, 4000);
}