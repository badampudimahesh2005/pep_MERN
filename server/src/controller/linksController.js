const { default: axios } = require('axios');
const Links = require('../models/linksModel');
const User = require('../models/userModel');
const Click = require('../models/Clicks');
const { getDeviceInfo } = require('../utils/linksUtility');


const createLink = async (req, res) => {
    
    const {campaignTitle, originalUrl, category} = req.body;
    try {

        const user = await User.findById({_id: req.user.id});
        if(user.credits < 1) {
            return res.status(400).json({
                message: 'Insufficient credits. Please purchase credits to create links.',
            });
        }

        const link = new Links({
            campaignTitle :campaignTitle,
            originalUrl : originalUrl,
            category : category,
            user: req.user.role === 'admin' ? req.user.id: req.user.adminId, // Allow admin to create links for other users
        });

        await link.save();

        // Deduct credits from user
        user.credits -= 1; // Deduct 1 credit for creating a link
        await user.save();

        
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

        const userId = req.user.role === 'admin' ? req.user.id : req.user.adminId;

        const links = await Links.find({user: userId}).sort({createdAt: -1});


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
        const userId = req.user.role === 'admin' ? req.user.id : req.user.adminId;
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
        
       if( link.user.toString() !== userId) {
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
        const userId = req.user.role === 'admin' ? req.user.id : req.user.adminId;
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

        if(link.user.toString() !== userId) {
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
        const userId = req.user.role === 'admin' ? req.user.id : req.user.adminId;
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

        if(link.user.toString() !== userId) {
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
        const userId = req.user.role === 'admin' ? req.user.id : req.user.adminId;

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


        if(link.user.toString() !== userId.toString()) {
            return res.status(403).json({
                message: 'Unauthorized access',
            });
        }


        const isDevelopment = process.env.NODE_ENV === 'development';
        const ipAddress = isDevelopment
            ? '8.8.8.8'
            : req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;

        // Log the IP address and link ID
        console.log(`Redirecting link with ID: ${id} from IP: ${ipAddress}`);

        const geoResponse = await axios.get(`http://ip-api.com/json/${ipAddress}`);

        const { city, country, region, lat, lon, isp } = geoResponse;

        const userAgent = req.headers['user-agent'] || 'Unknown';
        const { deviceType, browser } = getDeviceInfo(userAgent);

        const referrer = req.get('Referrer') || null;

        // Create a click record
        await Click.create({
            linkId: link._id,
            ip: ipAddress,
            city: city,
            country: country,
            region: region,
            latitude: lat,
            longitude: lon,
            isp: isp,
            referrer: referrer,
            userAgent: userAgent,
            deviceType: deviceType,
            browser: browser ,
            clickedAt: new Date(),
        });

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

const analytics = async (req, res) => {
    try {

        const {linkId, from , to} = req.query;

        const link = await Links.findById({_id: linkId});
        if (!link) {
            return res.status(404).json({
                message: 'Link does not exist with this ID',
            });
        }

        const userId = req.user.role === 'admin' 
            ? req.user.id 
            : req.user.adminId;

        
        if (link.user.toString() !== userId.toString()) {
            return res.status(403).json({
                message: 'Unauthorized access',
            });
        }


        const query = { linkId: linkId};

        if (from && to) {
            query.clickedAt = {
                $gte: new Date(from),
                $lte: new Date(to),
            };
        }
        const clicks = await Click.find(query).sort({ clickedAt: -1 });

        res.status(200).json(clicks);
       
    } catch (error) {
        console.error('Error fetching analytics:', error);
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
    redirectLink,
    analytics
};