(function ($) {
    'use strict';

    // Ensure global App namespace exists
    window.App = window.App || {};

    // Module for handling Reporting Dashboard logic
    var RepoDashboard = {
        initialize: function () {
            var data = [
                { data: [[0, 5]], color: "#FF9B08" }, // GDSN
                { data: [[1, 28]], color: "#FF5722" }, // VI
                { data: [[2, 4]], color: "#F44336" }, // VC
                { data: [[3, 2]], color: "#F03748" }, // FPI
                { data: [[4, 1]], color: "#EC3D6D" }, // FPC
                { data: [[5, 14]], color: "#E91E63" }, // CER
                { data: [[6, 3]], color: "#9C27B0" }, // CEC
                { data: [[7, 6]], color: "#3F51B5" }, // MDR
                { data: [[8, 20]], color: "#2196F3" }, // SAP
                { data: [[9, 14]], color: "#03A9F4" }, // SAPI
                { data: [[10, 10]], color: "#00BCD4" }, // MAD
                { data: [[11, 5]], color: "#4CAF50" }, // CPA
                { data: [[12, 5]], color: "#8BC34A" }, // IWC
                { data: [[13, 3]], color: "#CDDC39" }, // RIWC
                { data: [[14, 0.5]], color: "#FFEE58" }, // PIWC
                { data: [[15, 4]], color: "#FFEB3B" }, // RR
                { data: [[16, 2]], color: "#FFC107" }, // PTR
                { data: [[17, 7]], color: "#FFB300" }, // RFP
                //{data: [[18, 25]], color: "#0f0"} // RFP
            ];

            $.plot("#flotBarStatuses", data, {
                series: {
                    bars: {
                        show: true,
                        barWidth: 0.7,
                        align: "center",
                        lineWidth: 0,
                        fill: 1
                    }
                },
                grid: {
                    hoverable: true,
                    clickable: true,
                    borderColor: 'rgba(0, 0, 0, 0.1)',
                    borderWidth: 1,
                    labelMargin: 15,
                    backgroundColor: 'transparent'
                },
                tooltip: true,
                tooltipOpts: {
                    content: '%x: %y' + ' / 5',
                    shifts: {
                        x: -10,
                        y: 20
                    },
                    defaultTheme: true
                },
                xaxis: {
                    ticks: [
                        [0, "GDSN"], [1, "VI"], [2, "VC"], [3, "FPI"], [4, "FPC"], [5, "CER"], [6, "CEC"], [7, "MDR"], [8, "SAP"], [9, "SAPI"], [10, "MAD"], [11, "CPA"], [12, "IWC"], [13, "RIWC"], [14, "PIWC"], [15, "RR"], [16, "PTR"], [17, "RFP"]//,[18,"NEW"]
                    ],
                    tickLength: 0
                },
                yaxis: {
                    tickFormatter: function (val, axis) {
                        return val + '%';
                    }
                }
            });

        }
    };

    App.RepoDashboard = RepoDashboard;

})(jQuery);
