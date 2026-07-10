export const errorHandler = (err, req, res, next) => {
    console.error('❌ Error:', err);
    
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return res.status(400).json({
            success: false,
            error: `${field} already exists`
        });
    }
    
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
            success: false,
            error: errors.join(', ')
        });
    }
    
    res.status(err.status || 500).json({
        success: false,
        error: err.message || 'Internal Server Error'
    });
};