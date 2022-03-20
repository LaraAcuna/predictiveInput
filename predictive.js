function makePredictive(dom, width, inputProps, availableOptions, showAllByDefault = true) {
    /*
        inputProps => object with props like... classNames, name, etc... For now, only those two
    */
    while (dom.lastChild) {
        dom.removeChild(dom.lastChild); // we don't want a dirty containter!
    }

    dom.style.width = width; //This width is for both the input and the predictive box.
    dom.style.position = 'relative';

    const input = document.createElement('INPUT');
    input.style.width = '100%';
    input.type = 'text';
    const { name, classNames } = inputProps;
    if (name)
        input.name = name;
    if (classNames) {
        if (Array.isArray(classNames)) {
            classNames.forEach(className => input.classList.add(className));
        } else {
            input.classList.add(classNames);
        }
    }

    const predictive = document.createElement('DIV');
    predictive.style.width = '100%';
    predictive.style.zIndex = 2;
    predictive.style.position = 'absolute';
    predictive.style.border = "1px solid black";
    predictive.style.backgroundColor = "white";

    input.oninput = () => {
        while (predictive.lastChild) {
            predictive.removeChild(predictive.lastChild);
        }
        showPossibleOptions(availableOptions, input, predictive);
    }
    input.onblur = () => {
        while (predictive.lastChild) {
            predictive.removeChild(predictive.lastChild);
        }
    }
    input.onfocus = () => {
        if (showAllByDefault && input.value == "")
            fillPredictive(availableOptions, input, predictive);
        else
            showPossibleOptions(availableOptions, input, predictive);
    }

    dom.appendChild(input);
    dom.appendChild(predictive);
}

function showPossibleOptions(options, input, predictiveDom) {
    const inputString = input.value.trim().toLowerCase();
    if (inputString) {
        const matchedOptions = options.filter(option => {
            const searchKeys = [];
            if (option.searchDisplay) {
                searchKeys.push(option.displayText);
            }
            if (option.alternatives) {
                searchKeys.push(...option.alternatives);
            }
            return searchKeys.some(searchKey => searchKey.toLowerCase().includes(inputString));
        });
        fillPredictive(matchedOptions, input, predictiveDom);
    }
}

function fillPredictive(optionsToPut, input, predictiveDom) {
    optionsToPut.forEach(option => {
        const optionDom = createSelectableOption(option);
        optionDom.onclick = () => {
            if (option.selectAction) {
                option.selectAction();
            }
            input.blur();
        }
        predictiveDom.appendChild(optionDom);
    })
}

function createSelectableOption(option) {
    const selectableOption = document.createElement("div");
    selectableOption.appendChild(document.createTextNode(option.displayText));
    selectableOption.onmousedown = (event) => event.preventDefault();
    selectableOption.style
    return selectableOption;
}