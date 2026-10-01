<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard de Indicadores</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.0.0"></script>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f2f5; margin: 0; padding: 20px; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        h1 { color: #1a1a1a; margin: 0; }
        .admin-link { background: #333; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; }
        .admin-link:hover { background: #555; }

        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(600px, 1fr)); gap: 20px; }
        .card { background: white; border-radius: 10px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .card h2 { font-size: 1.1em; color: #444; text-align: center; margin-top: 0; margin-bottom: 20px; border-bottom: 2px solid #eee; padding-bottom: 10px; }
        .no-data { text-align: center; padding: 50px; color: #666; font-size: 1.2em; grid-column: 1 / -1; }
        .text-danger { color: #dc3545; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Dashboard de Indicadores 2026</h1>
        <a href="admin.php" class="admin-link">Painel Administrativo</a>
    </div>

    <div class="grid" id="dashboard-grid">
        <!-- Gráficos serão injetados aqui pelo script.js -->
    </div>

    <script src="script.js"></script>
</body>
</html>
