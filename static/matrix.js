document.addEventListener("DOMContentLoaded", () => {
    const bacteriaConfig = {
        "Escherichia coli": {
            color: "#CFE8BC",
            colorDark: "#94B37C",
            description: "Rod-shaped, slightly translucent cream to pale green"
        },
        "Staphylococcus aureus": {
            color: "#F8E5B9",
            colorDark: "#D4B161",
            description: "Spherical clusters, golden cream colored"
        },
        "Klebsiella pneumoniae": {
            color: "#E8E1D5",
            colorDark: "#B5A898",
            description: "Mucoid, grayish-white colonies"
        },
        "Pseudomonas aeruginosa": {
            color: "#D5E8E6",
            colorDark: "#89ABA8",
            description: "Iridescent, blue-green with metallic sheen"
        },
        "Clostridium difficile": {
            color: "#E8E4D5",
            colorDark: "#BAB297",
            description: "Ground-glass appearance, yellowish"
        },
        "Mycobacterium tuberculosis": {
            color: "#F0EBE0",
            colorDark: "#C5B8A0",
            description: "Rough, buff-colored colonies"
        }
    };

    const interactionData = {
        bacteria: [
            'Escherichia coli',
            'Staphylococcus aureus',
            'Klebsiella pneumoniae',
            'Pseudomonas aeruginosa',
            'Clostridium difficile',
            'Mycobacterium tuberculosis'
        ],
        antibiotics: [
            'Vancomycin',
            'Ciprofloxacin',
            'Meropenem',
            'Daptomycin',
            'Linezolid',
            'Rifampicin'
        ],
        interactions: {
            'Staphylococcus aureus-Vancomycin': { 
                level: 3, 
                mechanisms: ['Cell wall thickening', 'Peptidoglycan modification', 'D-Ala-D-Ala modification'],
                description: 'Strong interaction with documented resistance'
            },
            'Pseudomonas aeruginosa-Ciprofloxacin': { 
                level: 3, 
                mechanisms: ['DNA gyrase mutations', 'Efflux pump overexpression', 'Membrane permeability changes'],
                description: 'Rapid development of resistance observed'
            },
            'Klebsiella pneumoniae-Meropenem': { 
                level: 3, 
                mechanisms: ['Carbapenemase production', 'Porin loss', 'Efflux pump activation'],
                description: 'Critical clinical concern'
            },
            'Escherichia coli-Ciprofloxacin': { 
                level: 3, 
                mechanisms: ['DNA gyrase mutations', 'Plasmid-mediated resistance', 'Efflux pumps'],
                description: 'Common therapeutic combination'
            },
            'Mycobacterium tuberculosis-Rifampicin': { 
                level: 3, 
                mechanisms: ['RNA polymerase mutations', 'Cell wall impermeability', 'Efflux pumps'],
                description: 'Primary treatment option'
            },
            'Staphylococcus aureus-Daptomycin': { 
                level: 2, 
                mechanisms: ['Membrane modifications', 'Cell wall thickening'],
                description: 'Alternative treatment option'
            },
            'Escherichia coli-Meropenem': { 
                level: 2, 
                mechanisms: ['Beta-lactamase production', 'Porin modifications'],
                description: 'Effective but resistance possible'
            },
            'Pseudomonas aeruginosa-Meropenem': { 
                level: 2, 
                mechanisms: ['Carbapenemase production', 'Efflux pumps'],
                description: 'Used in severe infections'
            },
            'Staphylococcus aureus-Linezolid': { 
                level: 2, 
                mechanisms: ['23S rRNA modifications', 'cfr gene expression'],
                description: 'Reserved for resistant cases'
            }
        }
    };

    function createColorLegend() {
        const legend = document.createElement('div');
        legend.className = 'bacteria-color-legend';
        legend.innerHTML = '<h3>Bacterial Colony Appearances</h3>';

        Object.entries(bacteriaConfig).forEach(([bacteria, config]) => {
            const bacteriaEntry = document.createElement('div');
            bacteriaEntry.className = 'bacteria-entry';

            // Create color samples
            const colorContainer = document.createElement('div');
            colorContainer.className = 'color-samples';

            // Normal state color
            const normalColor = document.createElement('div');
            normalColor.className = 'color-sample';
            normalColor.style.backgroundColor = config.color;
            normalColor.title = 'Normal state';

            // Resistant state color
            const resistantColor = document.createElement('div');
            resistantColor.className = 'color-sample';
            resistantColor.style.backgroundColor = config.colorDark;
            resistantColor.title = 'Resistant state';

            colorContainer.appendChild(normalColor);
            colorContainer.appendChild(resistantColor);

            // Bacteria info
            const info = document.createElement('div');
            info.className = 'bacteria-info';
            info.innerHTML = `
                <div class="bacteria-name">${bacteria}</div>
                <div class="bacteria-description">${config.description}</div>
            `;

            bacteriaEntry.appendChild(colorContainer);
            bacteriaEntry.appendChild(info);
            legend.appendChild(bacteriaEntry);
        });

        return legend;
    }

    function createInteractionMatrix() {
        const table = document.createElement('table');
        table.className = 'interaction-matrix';

        // Create header row
        const headerRow = document.createElement('tr');
        const cornerCell = document.createElement('th');
        cornerCell.textContent = 'Bacteria / Antibiotics';
        cornerCell.className = 'corner-header';
        headerRow.appendChild(cornerCell);

        interactionData.antibiotics.forEach(antibiotic => {
            const th = document.createElement('th');
            th.textContent = antibiotic;
            th.className = 'matrix-header';
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        // Create data rows
        interactionData.bacteria.forEach(bacteria => {
            const row = document.createElement('tr');
            
            // Bacteria name cell with color indication
            const nameCell = document.createElement('td');
            const nameCellContent = document.createElement('div');
            nameCellContent.className = 'bacteria-name-container';
            
            // Color samples
            const colorSamples = document.createElement('div');
            colorSamples.className = 'color-indicators';
            
            const normalColor = document.createElement('span');
            normalColor.className = 'color-dot';
            normalColor.style.backgroundColor = bacteriaConfig[bacteria].color;
            
            const resistantColor = document.createElement('span');
            resistantColor.className = 'color-dot';
            resistantColor.style.backgroundColor = bacteriaConfig[bacteria].colorDark;
            
            colorSamples.appendChild(normalColor);
            colorSamples.appendChild(resistantColor);
            
            nameCellContent.appendChild(colorSamples);
            nameCellContent.appendChild(document.createTextNode(bacteria));
            nameCell.appendChild(nameCellContent);
            row.appendChild(nameCell);

            // Interaction cells
            interactionData.antibiotics.forEach(antibiotic => {
                const cell = document.createElement('td');
                const interaction = interactionData.interactions[`${bacteria}-${antibiotic}`];
                
                cell.className = `interaction-cell level-${interaction?.level || 1}`;
                
                const interactionContent = document.createElement('div');
                interactionContent.className = 'interaction-content';
                
                // Interaction symbol
                const symbol = document.createElement('span');
                symbol.className = 'interaction-symbol';
                symbol.textContent = interaction?.level === 3 ? '🔥' : 
                                   interaction?.level === 2 ? '⚡' : '−';
                interactionContent.appendChild(symbol);

                // Tooltip with detailed information
                if (interaction?.mechanisms) {
                    const tooltip = document.createElement('div');
                    tooltip.className = 'tooltip';
                    tooltip.innerHTML = `
                        <div class="tooltip-header">
                            <strong>${bacteria}</strong> + <strong>${antibiotic}</strong>
                        </div>
                        <div class="tooltip-body">
                            <div class="mechanisms">
                                <strong>Resistance Mechanisms:</strong>
                                <ul>
                                    ${interaction.mechanisms.map(m => `<li>${m}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="description">
                                ${interaction.description}
                            </div>
                        </div>
                    `;
                    interactionContent.appendChild(tooltip);
                }

                cell.appendChild(interactionContent);
                row.appendChild(cell);
            });
            
            table.appendChild(row);
        });

        const container = document.getElementById('interaction-matrix');
        container.innerHTML = '';
        container.appendChild(table);
        
        // Add color legend after the matrix
        const colorLegend = createColorLegend();
        container.appendChild(colorLegend);
    }

    // Initialize the matrix
    createInteractionMatrix();

    // Add window resize handler for responsiveness
    window.addEventListener('resize', () => {
        createInteractionMatrix();
    });
});
