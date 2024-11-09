document.addEventListener("DOMContentLoaded", () => {
    // Simulation configuration
    const config = {
        bacteria: {
            "Escherichia coli": {
                baseGrowthRate: 1.2,
                resistanceMechanisms: ["efflux pumps", "enzyme production", "plasmid transfer"],
                optimalTemp: 37,
                optimalPh: 7.0,
                color: "#2ECC71"
            },
            "Staphylococcus aureus": {
                baseGrowthRate: 1.0,
                resistanceMechanisms: ["cell wall modification", "biofilm formation", "enzyme production"],
                optimalTemp: 35,
                optimalPh: 7.5,
                color: "#F1C40F"
            },
            "Klebsiella pneumoniae": {
                baseGrowthRate: 0.9,
                resistanceMechanisms: ["capsule formation", "carbapenemase production", "efflux pumps"],
                optimalTemp: 37,
                optimalPh: 7.2,
                color: "#E74C3C"
            },
            "Pseudomonas aeruginosa": {
                baseGrowthRate: 1.1,
                resistanceMechanisms: ["biofilm formation", "efflux pumps", "outer membrane modification"],
                optimalTemp: 37,
                optimalPh: 7.0,
                color: "#3498DB"
            },
            "Clostridium difficile": {
                baseGrowthRate: 0.7,
                resistanceMechanisms: ["spore formation", "toxin production", "antibiotic inactivation"],
                optimalTemp: 37,
                optimalPh: 7.1,
                color: "#9B59B6"
            },
            "Mycobacterium tuberculosis": {
                baseGrowthRate: 0.4,
                resistanceMechanisms: ["cell wall modification", "drug-modifying enzymes", "efflux pumps"],
                optimalTemp: 37,
                optimalPh: 6.8,
                color: "#E67E22"
            }
        },
        antibiotics: {
            "Vancomycin": {
                mechanism: "cell wall synthesis",
                crossResistance: ["Daptomycin"],
                effectiveAgainst: ["Staphylococcus aureus", "Clostridium difficile"]
            },
            "Ciprofloxacin": {
                mechanism: "DNA gyrase inhibition",
                crossResistance: [],
                effectiveAgainst: ["Escherichia coli", "Pseudomonas aeruginosa"]
            },
            "Meropenem": {
                mechanism: "cell wall synthesis",
                crossResistance: ["Vancomycin"],
                effectiveAgainst: ["Klebsiella pneumoniae", "Escherichia coli"]
            },
            "Daptomycin": {
                mechanism: "cell membrane disruption",
                crossResistance: ["Vancomycin"],
                effectiveAgainst: ["Staphylococcus aureus"]
            },
            "Linezolid": {
                mechanism: "protein synthesis inhibition",
                crossResistance: [],
                effectiveAgainst: ["Staphylococcus aureus", "Mycobacterium tuberculosis"]
            },
            "Rifampicin": {
                mechanism: "RNA synthesis inhibition",
                crossResistance: [],
                effectiveAgainst: ["Mycobacterium tuberculosis"]
            }
        }
    };

    // Initialize UI controls
    const controls = {
        startButton: document.getElementById("start-button"),
        pauseButton: document.getElementById("pause-button"),
        resetButton: document.getElementById("reset-button"),
        bacteriaSelect: document.getElementById("bacteria-dropdown"),
        primaryAntibioticSelect: document.getElementById("primary-antibiotic"),
        secondaryAntibioticSelect: document.getElementById("secondary-antibiotic"),
        temperatureSlider: document.getElementById("temperature"),
        phSlider: document.getElementById("ph-level"),
        growthRateSlider: document.getElementById("growth-rate"),
        mutationRateSlider: document.getElementById("mutation-rate"),
        primaryDosageSlider: document.getElementById("primary-dosage"),
        secondaryDosageSlider: document.getElementById("secondary-dosage")
    };

    // Simulation state
    let simulationState = {
        running: false,
        paused: false,
        bacteriaPopulation: [],
        environmentalFactors: {
            temperature: 37,
            ph: 7.0
        },
        resistanceMechanisms: new Set(),
        crossResistance: new Set(),
        timeElapsed: 0,
        populationHistory: [],
        resistanceHistory: []
    };

    // Initialize simulation settings from UI controls
    function getSimulationSettings() {
        return {
            bacteria: controls.bacteriaSelect.value,
            primaryAntibiotic: controls.primaryAntibioticSelect.value,
            secondaryAntibiotic: controls.secondaryAntibioticSelect.value,
            temperature: parseFloat(controls.temperatureSlider.value),
            ph: parseFloat(controls.phSlider.value),
            growthRate: parseFloat(controls.growthRateSlider.value),
            mutationRate: parseFloat(controls.mutationRateSlider.value),
            primaryDosage: parseInt(controls.primaryDosageSlider.value),
            secondaryDosage: parseInt(controls.secondaryDosageSlider.value)
        };
    }
// Initialize bacteria population
    function initializePopulation() {
        const settings = getSimulationSettings();
        const bacteriaConfig = config.bacteria[settings.bacteria];
        
        simulationState.bacteriaPopulation = d3.range(500).map(() => ({
            x: Math.random() * 780 + 10,
            y: Math.random() * 380 + 10,
            resistanceLevel: Math.random() * settings.mutationRate,
            growthRate: bacteriaConfig.baseGrowthRate,
            activeMechanisms: [],
            alive: true,
            age: 0
        }));

        simulationState.timeElapsed = 0;
        simulationState.populationHistory = [];
        simulationState.resistanceHistory = [];
        simulationState.resistanceMechanisms.clear();
        simulationState.crossResistance.clear();
    }

    // Update bacteria based on environmental factors
    function applyEnvironmentalFactors(bacteria, settings) {
        const bacteriaConfig = config.bacteria[settings.bacteria];
        const tempEffect = 1 - Math.abs(settings.temperature - bacteriaConfig.optimalTemp) / 20;
        const phEffect = 1 - Math.abs(settings.ph - bacteriaConfig.optimalPh) / 4;
        
        return bacteria.growthRate * tempEffect * phEffect;
    }

    // Update bacterial population
    function updateBacterialPopulation() {
        const settings = getSimulationSettings();
        simulationState.timeElapsed += 1;

        // Update existing bacteria
        simulationState.bacteriaPopulation.forEach(bacteria => {
            if (!bacteria.alive) return;

            // Apply environmental factors
            const adjustedGrowthRate = applyEnvironmentalFactors(bacteria, settings);
            
            // Age bacteria
            bacteria.age += 1;

            // Handle reproduction
            if (Math.random() < adjustedGrowthRate * settings.growthRate) {
                if (simulationState.bacteriaPopulation.length < 1000) {
                    const childBacteria = {
                        x: bacteria.x + (Math.random() - 0.5) * 20,
                        y: bacteria.y + (Math.random() - 0.5) * 20,
                        resistanceLevel: bacteria.resistanceLevel,
                        growthRate: bacteria.growthRate,
                        activeMechanisms: [...bacteria.activeMechanisms],
                        alive: true,
                        age: 0
                    };
                    simulationState.bacteriaPopulation.push(childBacteria);
                }
            }

            // Handle mutations
            if (Math.random() < settings.mutationRate) {
                bacteria.resistanceLevel = Math.min(1, bacteria.resistanceLevel + 0.01);
                
                // Add new resistance mechanism
                const bacteriaConfig = config.bacteria[settings.bacteria];
                const availableMechanisms = bacteriaConfig.resistanceMechanisms
                    .filter(m => !bacteria.activeMechanisms.includes(m));
                
                if (availableMechanisms.length > 0) {
                    const newMechanism = availableMechanisms[
                        Math.floor(Math.random() * availableMechanisms.length)
                    ];
                    bacteria.activeMechanisms.push(newMechanism);
                    simulationState.resistanceMechanisms.add(newMechanism);
                }
            }

            // Natural death (based on age)
            if (bacteria.age > 1000) {
                bacteria.alive = Math.random() > 0.1;
            }
        });

        // Update history
        simulationState.populationHistory.push({
            time: simulationState.timeElapsed,
            count: simulationState.bacteriaPopulation.filter(b => b.alive).length
        });

        simulationState.resistanceHistory.push({
            time: simulationState.timeElapsed,
            averageResistance: d3.mean(
                simulationState.bacteriaPopulation.filter(b => b.alive),
                b => b.resistanceLevel
            )
        });

        // Limit history length
        if (simulationState.populationHistory.length > 100) {
            simulationState.populationHistory.shift();
        }
        if (simulationState.resistanceHistory.length > 100) {
            simulationState.resistanceHistory.shift();
        }
    }

    // Apply antibiotic effects
    function applyAntibiotics() {
        const settings = getSimulationSettings();
        
        simulationState.bacteriaPopulation.forEach(bacteria => {
            if (!bacteria.alive) return;

            let survivalProbability = bacteria.resistanceLevel;

            // Primary antibiotic effect
            const primaryEffective = config.antibiotics[settings.primaryAntibiotic]
                .effectiveAgainst.includes(settings.bacteria);
            
            if (primaryEffective && Math.random() > survivalProbability) {
                bacteria.alive = Math.random() > settings.primaryDosage / 100;
            }

            // Secondary antibiotic effect
            if (settings.secondaryAntibiotic !== 'none' && bacteria.alive) {
                const secondaryEffective = config.antibiotics[settings.secondaryAntibiotic]
                    .effectiveAgainst.includes(settings.bacteria);
                
                const crossResistant = config.antibiotics[settings.primaryAntibiotic]
                    .crossResistance.includes(settings.secondaryAntibiotic);
                
                const secondaryResistance = crossResistant ? survivalProbability : bacteria.resistanceLevel / 2;
                
                if (secondaryEffective && Math.random() > secondaryResistance) {
                    bacteria.alive = Math.random() > settings.secondaryDosage / 100;
                }
            }
        });
    }
// Visualization functions
    function renderMainSimulation() {
        const svg = d3.select("#main-simulation")
            .html("")
            .append("svg")
            .attr("width", 800)
            .attr("height", 400)
            .style("border-radius", "50%")
            .style("border", "4px solid #ccc");

        const defs = svg.append("defs");
        defs.append("filter")
            .attr("id", "blur")
            .append("feGaussianBlur")
            .attr("stdDeviation", 3);

        const settings = getSimulationSettings();
        const bacteriaColor = config.bacteria[settings.bacteria].color;

        const circles = svg.selectAll("circle")
            .data(simulationState.bacteriaPopulation);

        circles.enter()
            .append("circle")
            .merge(circles)
            .attr("r", d => d.alive ? Math.random() * 6 + 2 : 2)
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .attr("fill", d => {
                if (!d.alive) return "gray";
                const alpha = 0.6 + (d.resistanceLevel * 0.4);
                return d3.color(bacteriaColor).copy({opacity: alpha});
            })
            .attr("stroke", d => d.activeMechanisms.length > 0 ? "rgba(255, 0, 0, 0.7)" : "none")
            .attr("stroke-width", d => d.activeMechanisms.length)
            .attr("filter", "url(#blur)");

        circles.exit().remove();
    }

    function renderHistogram() {
        const svg = d3.select("#histogram")
            .html("")
            .append("svg")
            .attr("width", 200)
            .attr("height", 100);

        const resistanceLevels = simulationState.bacteriaPopulation
            .filter(d => d.alive)
            .map(d => d.resistanceLevel);

        const bins = d3.histogram()
            .domain([0, 1])
            .thresholds(20)(resistanceLevels);

        const y = d3.scaleLinear()
            .domain([0, d3.max(bins, d => d.length)])
            .range([100, 0]);

        svg.selectAll("rect")
            .data(bins)
            .enter()
            .append("rect")
            .attr("x", (d, i) => i * (200 / bins.length))
            .attr("y", d => y(d.length))
            .attr("width", 200 / bins.length - 1)
            .attr("height", d => 100 - y(d.length))
            .attr("fill", "steelblue");
    }

    function renderPopulationGraph() {
        const svg = d3.select("#population-graph")
            .html("")
            .append("svg")
            .attr("width", 200)
            .attr("height", 100);

        if (simulationState.populationHistory.length < 2) return;

        const x = d3.scaleLinear()
            .domain([
                d3.min(simulationState.populationHistory, d => d.time),
                d3.max(simulationState.populationHistory, d => d.time)
            ])
            .range([0, 200]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(simulationState.populationHistory, d => d.count)])
            .range([100, 0]);

        const line = d3.line()
            .x(d => x(d.time))
            .y(d => y(d.count));

        svg.append("path")
            .datum(simulationState.populationHistory)
            .attr("fill", "none")
            .attr("stroke", "green")
            .attr("stroke-width", 1.5)
            .attr("d", line);
    }

    function renderResistanceMechanisms() {
        const container = d3.select("#mechanism-list")
            .html("");

        Array.from(simulationState.resistanceMechanisms)
            .forEach((mechanism, i) => {
                container.append("div")
                    .attr("class", "mechanism-item")
                    .text(mechanism)
                    .style("color", d3.schemeCategory10[i % 10]);
            });
    }

    function renderEnvironmentalImpact() {
        const svg = d3.select("#environmental-visualization")
            .html("")
            .append("svg")
            .attr("width", 200)
            .attr("height", 100);

        const settings = getSimulationSettings();
        const bacteriaConfig = config.bacteria[settings.bacteria];

        const tempEffect = 1 - Math.abs(settings.temperature - bacteriaConfig.optimalTemp) / 20;
        const phEffect = 1 - Math.abs(settings.ph - bacteriaConfig.optimalPh) / 4;

        // Temperature effect bar
        svg.append("rect")
            .attr("x", 10)
            .attr("y", 20)
            .attr("width", tempEffect * 180)
            .attr("height", 20)
            .attr("fill", "orange");

        svg.append("text")
            .attr("x", 10)
            .attr("y", 15)
            .text(`Temperature Effect: ${Math.round(tempEffect * 100)}%`)
            .attr("font-size", "10px");

        // pH effect bar
        svg.append("rect")
            .attr("x", 10)
            .attr("y", 60)
            .attr("width", phEffect * 180)
            .attr("height", 20)
            .attr("fill", "purple");

        svg.append("text")
            .attr("x", 10)
            .attr("y", 55)
            .text(`pH Effect: ${Math.round(phEffect * 100)}%`)
            .attr("font-size", "10px");
    }

    function renderFrequencyHeatmap() {
        const svg = d3.select("#heatmap-visualization")
            .html("")
            .append("svg")
            .attr("width", 200)
            .attr("height", 100);

        // Create a 10x5 grid for the heatmap
        const cellWidth = 20;
        const cellHeight = 20;
        const gridData = [];

        // Calculate bacteria density in each grid cell
        for (let y = 0; y < 5; y++) {
            for (let x = 0; x < 10; x++) {
                const cellBacteria = simulationState.bacteriaPopulation.filter(b => {
                    return b.alive &&
                        b.x >= x * 80 && b.x < (x + 1) * 80 &&
                        b.y >= y * 80 && b.y < (y + 1) * 80;
                });

                gridData.push({
                    x: x * cellWidth,
                    y: y * cellHeight,
                    density: cellBacteria.length
                });
            }
        }

        // Find max density for scaling
        const maxDensity = d3.max(gridData, d => d.density) || 1;

        // Color scale for the heatmap
        const colorScale = d3.scaleSequential()
            .domain([0, maxDensity])
            .interpolator(d3.interpolateBlues);

        // Draw heatmap cells
        svg.selectAll("rect")
            .data(gridData)
            .enter()
            .append("rect")
            .attr("x", d => d.x)
            .attr("y", d => d.y)
            .attr("width", cellWidth)
            .attr("height", cellHeight)
            .attr("fill", d => colorScale(d.density))
            .attr("stroke", "#fff")
            .attr("stroke-width", 1);
    }

    function renderAntibioticGradient() {
        const svg = d3.select("#gradient-visualization")
            .html("")
            .append("svg")
            .attr("width", 200)
            .attr("height", 100);

        const settings = getSimulationSettings();
        
        // Create gradients for both antibiotics
        const defs = svg.append("defs");
        
        // Primary antibiotic gradient
        const primaryGradient = defs.append("linearGradient")
            .attr("id", "primary-gradient")
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "100%")
            .attr("y2", "0%");

        primaryGradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "#ff6b6b")
            .attr("stop-opacity", settings.primaryDosage / 100);

        primaryGradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#ff6b6b")
            .attr("stop-opacity", 0);

        // Secondary antibiotic gradient (if selected)
        if (settings.secondaryAntibiotic !== 'none') {
            const secondaryGradient = defs.append("linearGradient")
                .attr("id", "secondary-gradient")
                .attr("x1", "0%")
                .attr("y1", "0%")
                .attr("x2", "100%")
                .attr("y2", "0%");

            secondaryGradient.append("stop")
                .attr("offset", "0%")
                .attr("stop-color", "#4dabf7")
                .attr("stop-opacity", settings.secondaryDosage / 100);

            secondaryGradient.append("stop")
                .attr("offset", "100%")
                .attr("stop-color", "#4dabf7")
                .attr("stop-opacity", 0);
        }

        // Draw primary antibiotic gradient
        svg.append("rect")
            .attr("x", 0)
            .attr("y", 20)
            .attr("width", 200)
            .attr("height", 30)
            .attr("fill", "url(#primary-gradient)");

        // Add label for primary antibiotic
        svg.append("text")
            .attr("x", 5)
            .attr("y", 15)
            .attr("fill", "#666")
            .attr("font-size", "10px")
            .text(`${settings.primaryAntibiotic} (${settings.primaryDosage}%)`);

        // Draw secondary antibiotic gradient if selected
        if (settings.secondaryAntibiotic !== 'none') {
            svg.append("rect")
                .attr("x", 0)
                .attr("y", 60)
                .attr("width", 200)
                .attr("height", 30)
                .attr("fill", "url(#secondary-gradient)");

            // Add label for secondary antibiotic
            svg.append("text")
                .attr("x", 5)
                .attr("y", 55)
                .attr("fill", "#666")
                .attr("font-size", "10px")
                .text(`${settings.secondaryAntibiotic} (${settings.secondaryDosage}%)`);
        }
    }

    // Simulation loop
    function runSimulation() {
        if (!simulationState.running || simulationState.paused) return;

        updateBacterialPopulation();
        applyAntibiotics();
        
        renderMainSimulation();
        renderHistogram();
        renderPopulationGraph();
        renderResistanceMechanisms();
        renderEnvironmentalImpact();
        renderFrequencyHeatmap();
        renderAntibioticGradient();

        requestAnimationFrame(runSimulation);
    }

    // Event listeners for controls
    controls.startButton.addEventListener("click", () => {
        simulationState.running = true;
        simulationState.paused = false;
        runSimulation();
    });

    controls.pauseButton.addEventListener("click", () => {
        simulationState.paused = !simulationState.paused;
        if (!simulationState.paused) runSimulation();
    });

    controls.resetButton.addEventListener("click", () => {
        simulationState.running = false;
        simulationState.paused = false;
        initializePopulation();
        renderMainSimulation();
        renderHistogram();
        renderPopulationGraph();
        renderResistanceMechanisms();
        renderEnvironmentalImpact();
        renderFrequencyHeatmap();
        renderAntibioticGradient();
    });

    // Event listeners for sliders
    controls.temperatureSlider.addEventListener("input", () => {
        document.getElementById("temperature-display").textContent = 
            `${controls.temperatureSlider.value}°C`;
    });

    controls.phSlider.addEventListener("input", () => {
        document.getElementById("ph-display").textContent = 
            controls.phSlider.value;
    });

    controls.growthRateSlider.addEventListener("input", () => {
        document.getElementById("growth-rate-display").textContent = 
            `${controls.growthRateSlider.value}x`;
    });

    controls.mutationRateSlider.addEventListener("input", () => {
        document.getElementById("mutation-rate-display").textContent = 
            `${controls.mutationRateSlider.value} mutations/sec`;
    });

    controls.primaryDosageSlider.addEventListener("input", () => {
        document.getElementById("primary-dosage-display").textContent = 
            `${controls.primaryDosageSlider.value}%`;
    });

    controls.secondaryDosageSlider.addEventListener("input", () => {
        document.getElementById("secondary-dosage-display").textContent = 
            `${controls.secondaryDosageSlider.value}%`;
    });

    // Initialize simulation on page load
    initializePopulation();
    renderMainSimulation();
    renderHistogram();
    renderPopulationGraph();
    renderResistanceMechanisms();
    renderEnvironmentalImpact();
    renderFrequencyHeatmap();
    renderAntibioticGradient();
});
