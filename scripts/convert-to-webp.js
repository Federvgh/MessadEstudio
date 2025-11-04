#!/usr/bin/env node

/**
 * WebP Conversion Script
 * Converts JPG and PNG images to WebP format with optimal quality
 *
 * Usage:
 *   node scripts/convert-to-webp.js                    # Convert all images
 *   node scripts/convert-to-webp.js --priority         # Convert priority images only
 *   node scripts/convert-to-webp.js --file img_5.jpg   # Convert specific file
 *
 * Requirements:
 *   npm install sharp
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Configuration
const CONFIG = {
  imagesDir: path.join(__dirname, '..', 'images'),
  originalsDir: path.join(__dirname, '..', 'images', 'originals'),
  quality: 85,
  skipExisting: true, // Skip if .webp already exists
};

// Priority images (high impact, actively used)
const PRIORITY_IMAGES = [
  'img_5.jpg',    // 158 KB, used 2x
  'img_3.jpg',    // 42 KB, used 2x
  'img_4.jpg',    // 80 KB, used 3x
  'img_7.jpg',    // 96 KB, used 2x
  'person_1.jpg', // 9.9 KB, used 3x
  'person_2.jpg', // 10 KB, used 3x
  'person_3.jpg', // 9.8 KB, used 1x
  'person_4.jpg', // 17 KB, used 2x
  'world-dotted-map.png', // 196 KB
];

// Parse command line arguments
const args = process.argv.slice(2);
const priorityOnly = args.includes('--priority');
const specificFile = args.includes('--file') ? args[args.indexOf('--file') + 1] : null;

/**
 * Check if sharp is installed
 */
async function checkSharp() {
  try {
    require.resolve('sharp');
    return true;
  } catch (e) {
    console.error('❌ sharp is not installed.');
    console.log('📦 Installing sharp...');
    try {
      await execAsync('npm install sharp');
      console.log('✅ sharp installed successfully');
      return true;
    } catch (installError) {
      console.error('❌ Failed to install sharp:', installError.message);
      console.log('\n💡 Please run manually: npm install sharp');
      return false;
    }
  }
}

/**
 * Get file size in KB
 */
function getFileSizeKB(filePath) {
  const stats = fs.statSync(filePath);
  return (stats.size / 1024).toFixed(2);
}

/**
 * Convert image to WebP
 */
async function convertToWebP(inputPath, outputPath) {
  const sharp = require('sharp');

  try {
    await sharp(inputPath)
      .webp({ quality: CONFIG.quality })
      .toFile(outputPath);

    return true;
  } catch (error) {
    console.error(`  ❌ Error converting: ${error.message}`);
    return false;
  }
}

/**
 * Copy original to originals directory
 */
function backupOriginal(fileName) {
  const sourcePath = path.join(CONFIG.imagesDir, fileName);
  const destPath = path.join(CONFIG.originalsDir, fileName);

  // Create originals directory if it doesn't exist
  if (!fs.existsSync(CONFIG.originalsDir)) {
    fs.mkdirSync(CONFIG.originalsDir, { recursive: true });
  }

  // Only copy if not already in originals
  if (!fs.existsSync(destPath)) {
    fs.copyFileSync(sourcePath, destPath);
    return true;
  }

  return false;
}

/**
 * Process a single image file
 */
async function processImage(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  const baseName = path.basename(fileName, ext);

  const inputPath = path.join(CONFIG.imagesDir, fileName);
  const outputPath = path.join(CONFIG.imagesDir, `${baseName}.webp`);

  // Skip if WebP already exists
  if (CONFIG.skipExisting && fs.existsSync(outputPath)) {
    console.log(`  ⏭️  ${fileName} → Already has WebP version`);
    return { skipped: true };
  }

  // Get original size
  const originalSize = getFileSizeKB(inputPath);

  console.log(`  🔄 Converting ${fileName} (${originalSize} KB)...`);

  // Backup original
  const backedUp = backupOriginal(fileName);
  if (backedUp) {
    console.log(`    📋 Backed up to originals/`);
  }

  // Convert to WebP
  const success = await convertToWebP(inputPath, outputPath);

  if (success) {
    const webpSize = getFileSizeKB(outputPath);
    const savings = ((1 - webpSize / originalSize) * 100).toFixed(1);

    console.log(`    ✅ Created ${baseName}.webp (${webpSize} KB)`);
    console.log(`    💾 Savings: ${savings}% (${(originalSize - webpSize).toFixed(2)} KB)`);

    return {
      fileName,
      originalSize: parseFloat(originalSize),
      webpSize: parseFloat(webpSize),
      savings: parseFloat(savings),
      success: true,
    };
  }

  return { success: false };
}

/**
 * Get list of images to process
 */
function getImagesToProcess() {
  // Specific file
  if (specificFile) {
    return [specificFile];
  }

  // Priority images only
  if (priorityOnly) {
    return PRIORITY_IMAGES;
  }

  // All JPG and PNG files without WebP versions
  const allFiles = fs.readdirSync(CONFIG.imagesDir);

  return allFiles.filter(file => {
    const ext = path.extname(file).toLowerCase();
    const baseName = path.basename(file, ext);
    const webpPath = path.join(CONFIG.imagesDir, `${baseName}.webp`);

    // Include if it's JPG or PNG and doesn't have WebP version
    return (ext === '.jpg' || ext === '.jpeg' || ext === '.png') &&
           !fs.existsSync(webpPath);
  });
}

/**
 * Main execution
 */
async function main() {
  console.log('\n🖼️  WebP Conversion Script\n');
  console.log(`📁 Images directory: ${CONFIG.imagesDir}`);
  console.log(`⚙️  Quality: ${CONFIG.quality}`);
  console.log('');

  // Check if sharp is available
  const sharpAvailable = await checkSharp();
  if (!sharpAvailable) {
    process.exit(1);
  }

  // Get images to process
  const imagesToProcess = getImagesToProcess();

  if (imagesToProcess.length === 0) {
    console.log('✅ No images to convert (all have WebP versions)');
    process.exit(0);
  }

  console.log(`📝 Found ${imagesToProcess.length} images to convert\n`);

  if (priorityOnly) {
    console.log('🎯 Processing PRIORITY images only\n');
  }

  if (specificFile) {
    console.log(`🎯 Processing specific file: ${specificFile}\n`);
  }

  // Process all images
  const results = [];

  for (const fileName of imagesToProcess) {
    const result = await processImage(fileName);
    if (result.success) {
      results.push(result);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 CONVERSION SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Converted: ${results.length} images`);

  if (results.length > 0) {
    const totalOriginalSize = results.reduce((sum, r) => sum + r.originalSize, 0);
    const totalWebpSize = results.reduce((sum, r) => sum + r.webpSize, 0);
    const totalSavings = totalOriginalSize - totalWebpSize;
    const avgSavings = (totalSavings / totalOriginalSize * 100).toFixed(1);

    console.log(`📦 Original total: ${totalOriginalSize.toFixed(2)} KB`);
    console.log(`📦 WebP total: ${totalWebpSize.toFixed(2)} KB`);
    console.log(`💾 Total savings: ${totalSavings.toFixed(2)} KB (${avgSavings}%)`);
  }

  console.log('\n🎉 Conversion complete!\n');
  console.log('📝 Next steps:');
  console.log('  1. Update HTML to use <picture> tags with WebP sources');
  console.log('  2. Test in different browsers');
  console.log('  3. Verify images load correctly');
  console.log('');
}

// Run script
main().catch(error => {
  console.error('\n❌ Fatal error:', error.message);
  process.exit(1);
});
