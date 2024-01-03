const Banner = require('../models/bannerModal')
const sharp = require('sharp')
const path = require('path');
const mongoose = require('mongoose');


const loadBanner = async (req, res) => {
    try {
        console.log("Banner received")
        const bannerData = await Banner.find()
        res.render('banner',{banner:bannerData})
    } catch (error) {
        console.log(error.message);
    }
};

const addBanner = async(req,res) =>{
    try {
        console.log("add banner received")
        console.log(req.body)
        const cropStatus = req.body.cropStatus;
      

        const newImages = [];
        if (req.files && req.files.length > 0) {
            console.log("files 1")
            if( cropStatus == 'on'){
                for (const file of req.files) {
                    const filename = file.filename;
                    console.log("files 2")
            
                    const croppedImageBuffer = await sharp(file.path)
                        .resize({ width: 1000, height: 1000, fit: 'cover' }) // Example cropping options
                        .toBuffer();
            
                    const croppedFilename = `cropped_${filename}`;
            
                    const outputPath = path.join(__dirname,`../public/admin/images/banner/${croppedFilename}`);
                    // Save the cropped image
                    await sharp(croppedImageBuffer)
                        .toFile(outputPath);
                       
                    newImages.push(croppedFilename);
                }

            }else{
                if (req.files && req.files.length > 0) {
                    for (const file of req.files) {
                        const filename = file.filename;                           
                        newImages.push(filename);
                    }     
                    console.log("Cropped Images:", newImages);
                }
            }
            
        

            console.log("Cropped Images:", newImages);
        }
        // console.log("Images :",images)
        console.log("Images :",req.body)
        const newProduct = new Banner({
            name:req.body.bannerName,
            text:req.body.bannerText,
            text2:req.body.bannerText2,
            expiryDate:req.body.bannerExpiryDate
            // image:images

        })

        
        // console.log('inages  ;',req.body.image)
        console.log("kkk")
        // console.log(images)
        newProduct.image.push(...newImages)
        const productInsertedData = await newProduct.save()
        const bannerData =  await Banner.find()
        if(productInsertedData){
            console.log("inserted")
            res.render('banner',{banner:bannerData,successMessage:"Banner Updated "})
        }else{
            console.log("not inserted")
            res.render('banner',{banner:bannerData,successMessage:"Banner Updated "})
        }
        
        
    } catch (error) {
        console.log(error.message)
        
    }
}

const updateBanner  = async (req, res) => {
    try {
        console.log('update Banner received')
        console.log(req.body)
        
        // console.log(req.files)
        const cropStatus = req.body.cropStatus || 'off'
        const newImages = [];
        const  { id,bannerName,bannerText,bannerText2,bannerExpiryDate,target} = req.body
        console.log(id,bannerName,bannerText,bannerText2,bannerExpiryDate,cropStatus)
        const bannerId = new mongoose.Types.ObjectId(req.body.bannerId)
        const banner = await Banner.findOne({_id:bannerId});
        console.log("Banner :",banner)

        banner.name = bannerName;
        banner.text = bannerText;
        banner.text2 = bannerText2;
        banner.target = target;
        banner.bannerExpiryDate = new Date(bannerExpiryDate);

        if (req.files && req.files.length > 0) {
            console.log("files 1")
            if( cropStatus == 'on'){
                for (const file of req.files) {
                    const filename = file.filename;
                    console.log("files 2")
                    const croppedImageBuffer = await sharp(file.path)
                        .resize({ width: 650, height: 300, fit: 'cover' }) // Example cropping options
                        .toBuffer();
            
                    const croppedFilename = `cropped_${filename}`;           
                    const outputPath = path.join(__dirname,`../public/admin/images/banner/${croppedFilename}`);
                    // Save the cropped image
                    await sharp(croppedImageBuffer)
                        .toFile(outputPath);
                       
                    newImages.push(croppedFilename);
                }
                // banner.image.push(...newImages);
                banner.image = newImages


            }else{
                if (req.files && req.files.length > 0) {
                    for (const file of req.files) {
                        const filename = file.filename;                           
                        newImages.push(filename);
                    }     
                    console.log("Cropped Images:", newImages);
                }
                // banner.image.push(...newImages);
                banner.image = newImages

            }
            
        }
        
        const updateBanner  = await banner.save();
        const bannerData = await Banner.find()
        if(updateBanner){
            console.log("Update successfully")
            res.render('banner',{banner:bannerData,successMessage:"Banner Updated "})
        }else{
            res.render('banner',{banner:bannerData,warnningMessage:"Failed to Update Banner "})        
        }
    } catch (error) {
        console.log(error.message);
    }
};

module.exports ={
    loadBanner,
    addBanner,
    updateBanner
}