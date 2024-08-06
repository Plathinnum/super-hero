// Función para mostrar modales de bootstrap
function showErrorModal(message) {
    $('#modalMessage').text(message);
    $('#errorModal').modal('show');
}
// Función que ejecuta el código una vez cargado el DOM
$(function () {
    // Se crea una regex que solo admite números enteros
    let validateDigit = /^\d+$/;
    // Función con parámetro hero
    let request = (hero) => {
        // Se verifica que hero exista y que cumpla con las expresión regular
        if (hero && validateDigit.test(hero)) {
            //Solicitud ajax para obtener datos de la api, definiendo el tipo, la request y la url
            $.ajax({
                dataType: "json",
                type: "get",
                url: `https://www.superheroapi.com/api.php/3525635500807579/${hero}`,
                // Si está correcto crea contenido
                success: (result) => {
                    if (result.response === 'success') {
                        // Contenido dinámico que se incrustará al DOM
                        let insertDOM = `<h3 class="text-center">SuperHero Encontrado</h3>
                                        <div class="card">
                                            <div class="row no-gutters">
                                                <div class="col-md-4">
                                                    <img src="${result.image.url}" class="card-img" alt="${result.name}">
                                                </div>
                                                <div class="col-md-8">
                                                    <div class="card-body">
                                                        <h5 class="card-title">Nombre: ${result.name}</h5>
                                                        <p class="card-text">Conexiones: ${result.connections['group-affiliation']}</p>
                                                        <ul class="list-group list-group-flush">
                                                            <li class="list-group-item"><em>Publicado por</em>: ${result.biography.publisher}</li>
                                                            <li class="list-group-item"><em>Ocupación:</em> ${result.work.occupation}</li>
                                                            <li class="list-group-item"><em>Primera Aparición:</em> ${result.biography['first-appearance']}</li>
                                                            <li class="list-group-item"><em>Altura:</em> ${result.appearance.height.join(" - ")}.</li>
                                                            <li class="list-group-item"><em>Peso:</em> ${result.appearance.weight.join(" - ")}.</li>
                                                            <li class="list-group-item"><em>Alianzas:</em> ${result.biography.aliases.join(", ")}</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>`;

                        // Se inserta el contenido html de insertDom en esta id contenedora
                        $('#heroCard').append(insertDOM);

                        // Array para almacenar los datos del gráfico
                        let graphData = [];
                        // Iteración de estadísticas paraq parsearlas
                        for (const key in result.powerstats) {
                            graphData.push(
                                {
                                    label: key,
                                    y: parseInt(result.powerstats[key])
                                });
                        };

                        // Configuración para el tipo de gráfico de Canvas
                        var config = {
                            title: {
                                text: `Estadísticas de poder para ${result.name}`
                            },
                            data: [{
                                type: "pie",
                                startAngle: 45,
                                showInLegend: "true",
                                legendText: "{label}",
                                indexLabel: "{label} ({y})",
                                yValueFormatString: "#,##0.#" % "",
                                dataPoints: graphData
                            }]
                        };

                        // Se insertan las configuraciones del gráfico en una id contenedora
                        $("#pieChart").CanvasJSChart(config);

                    } else {
                        showErrorModal("El ID de superhéroe no existe.");
                    };
                },
                error: () => {
                    showErrorModal("No se pueden obtener datos");
                }
            });
        } else {
            showErrorModal("Solo se pueden ingresar números");
        };
    }

    // Manejador de evento
    $('form').on('submit', (event) => {
        // Se previene el comportamiento por defecto
        event.preventDefault();
        // Se limpia el contenido de los contenedores
        $("#heroCard").html(" ");
        $("#pieChart").html(" ");
        // Se extrae el valor del campo input que tiene id "nohero" en el html
        hero = $('#nohero').val();
        // Se llama a la función "request" con el número ingresado en el input
        request(hero);
    });

});