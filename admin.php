<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Painel Administrativo - Indicadores</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; background: #f4f4f4; }
        .card { background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        h2 { margin-top: 0; color: #333; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; font-weight: bold; }
        input[type="file"] { display: block; margin-bottom: 10px; }
        button { background: #007bff; color: white; border: none; padding: 10px 15px; border-radius: 4px; cursor: pointer; }
        button:hover { background: #0056b3; }
        .message { padding: 10px; margin-top: 10px; border-radius: 4px; display: none; }
        .success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        .nav { margin-bottom: 20px; }
        .nav a { display: inline-block; padding: 10px 15px; background: #333; color: white; text-decoration: none; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="nav">
        <a href="index.php">Ver Dashboard</a>
    </div>
    <h1>Painel Administrativo</h1>

    <div id="forms-container"></div>

    <script>
        const graphs = [
            { type: 'perdas', title: 'Perdas na Produção' },
            { type: 'pcp', title: 'PCP' },
            { type: 'qualidade', title: 'Qualidade (Refugo/Reprocesso)' },
            { type: 'manutencao', title: 'Manutenção' }
        ];

        const container = document.getElementById('forms-container');

        graphs.forEach(g => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h2>${g.title}</h2>
                <form id="form-${g.type}" onsubmit="uploadFile(event, '${g.type}')">
                    <div class="form-group">
                        <label>Upload Planilha Excel (.xlsx)</label>
                        <input type="file" name="file" accept=".xlsx" required>
                    </div>
                    <button type="submit">Atualizar Gráfico</button>
                    <div id="msg-${g.type}" class="message"></div>
                </form>
            `;
            container.appendChild(card);
        });

        async function uploadFile(event, type) {
            event.preventDefault();
            const form = event.target;
            const formData = new FormData(form);
            formData.append('type', type);

            const msgDiv = document.getElementById(`msg-${type}`);
            msgDiv.style.display = 'none';
            msgDiv.className = 'message';

            try {
                const response = await fetch('upload.php', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();

                msgDiv.style.display = 'block';
                if (result.success) {
                    msgDiv.textContent = 'Arquivo processado e gráfico atualizado com sucesso!';
                    msgDiv.classList.add('success');
                } else {
                    msgDiv.textContent = 'Erro: ' + result.error;
                    msgDiv.classList.add('error');
                }
            } catch (err) {
                msgDiv.style.display = 'block';
                msgDiv.textContent = 'Erro na comunicação com o servidor.';
                msgDiv.classList.add('error');
            }
        }
    </script>
</body>
</html>
