


const validateNewMatch = {
    title: {
        isEmpty: { errorMessage: 'Field must not be empty.' }, 
        isLength: {
            errorMessage: 'Character requirements not met.',
            options: { min: 1, max: 20 }
        },
        isAlphanumeric: {            
            errorMessage: 'Invalid input type.',
            matches: '/([A-Za-z -\'])\w+/'
        }
    },
    'players.*': {
        isEmpty: { errorMessage: 'Fields must not be empty.' },
    },
    'players.*.firstName': {
        isLength: {
            errorMessage: 'Character requirements not met.',
            options: { min: 1, max: 20 }
        },
        isAlpha: { errorMessage: 'Invalid input type.' }
    },
    'players.*.lastName': {
        isLength: {
            errorMessage: 'Character requirements not met.',
            options: { min: 1, max: 20 }
        },
        isAlpha: { errorMessage: 'Invalid input type.' }
    },
    description: {
        optional: true
    },
    duration: {
        notEmpty: true,
        isNumeric: {
            errorMessage: 'Invalid input type.',
            options: { no_symbols: true }
        },
        isInt: {
            min: 1,
            errorMessage: 'Duration too small.'
        }, 
        toInt: true
    }
};


module.exports = { validateNewMatch };