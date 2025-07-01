const Links = require('../models/linksModel');


const createLink = async (req, res) => {
    
    const {campaignTitle, originalUrl, category} = req.body;
    try {
        const link = new Links({
            campaignTitle :campaignTitle,
            originalUrl : originalUrl,
            category : category,
            user: req.user.id
        });

        await link.save();
        res.status(201).json({
            message: 'Link created successfully',
            data: {id: link._id},
        });
    } catch (error) {
        console.error('Error creating link:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    }
};

const getLinks = async (req, res) => {
    try {

        const links = await Links.find({user: req.user.id}).sort({createdAt: -1});


       res.status(200).json({
           message: 'Links fetched successfully',
           data: links
       });

    }catch (error) {
        console.error('Error fetching links:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    }
};

const getLinkById = async (req, res) => {
    try {
        const {id} = req.params;
        if (!id) {
            return res.status(400).json({
                message: 'Link ID is required',
            });
        }
        const link = await Links.findById(id);
        if (!link) {
            return res.status(404).json({
                message: 'Link does not exist with this ID',
            });
        }
        
       if( link.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: 'Unauthorized access ',
            });
        }

        res.status(200).json({
            message: 'Link fetched successfully',
            data: link,
        });

    } catch (error) {
        console.error('Error fetching link:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    }
};

const updateLink = async (req, res)=>{
    try{
        const {id} = req.params;
        if (!id) {
            return res.status(400).json({
                message: 'Link ID is required',
            });
        }

        let link = await Links.findById(id);
        if (!link) {
            return res.status(404).json({
                message: 'Link does not exist with this ID',
            });
        }

        if(link.user.toString() !== req.user.id.toString()) {
            return res.status(403).json({
                message: 'Unauthorized access',
            });
        }



        const {campaignTitle, originalUrl, category} = req.body;

        link = await Links.findByIdAndUpdate(id, {
            campaignTitle: campaignTitle,
            orginalUrl: originalUrl,
            category: category,
        }, {new: true});

        res.status(200).json({
            message: 'Link updated successfully',
            data: link,
        });

    }catch (error) {
        console.error('Error updating link:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    }
}

const deleteLink = async (req, res) => {
    try {
        const {id} = req.params;
        if (!id) {
            return res.status(400).json({
                message: 'Link ID is required',
            });
        }

        const link = await Links.findById(id);
        if (!link) {
            return res.status(404).json({
                message: 'Link does not exist with this ID',
            });
        }

        if(link.user.toString() !== req.user.id.toString()) {
            return res.status(403).json({
                message: 'Unauthorized access',
            });
        }

        await Links.findByIdAndDelete(id);

        res.status(200).json({
            message: 'Link deleted successfully',
        });

    } catch (error) {
        console.error('Error deleting link:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    }
};

const redirectLink = async (req, res) => {
    try {
        const {id} = req.params;
        if (!id) {
            return res.status(400).json({
                message: 'Link ID is required',
            });
        }

        let link = await Links.findById(id);
        if (!link) {
            return res.status(404).json({
                message: 'Link does not exist with this ID',
            });
        }

        if(link.user.toString() !== req.user.id.toString()) {
            return res.status(403).json({
                message: 'Unauthorized access',
            });
        }

        link.clickCount += 1;
        await link.save();

        res.redirect(link.originalUrl);

    } catch (error) {
        console.error('Error redirecting link:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    }
};

module.exports = {
    createLink,
    getLinks,
    getLinkById,
    updateLink,
    deleteLink,
    redirectLink
};