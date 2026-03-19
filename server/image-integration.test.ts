import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Image Integration Tests', () => {
  const assetsDir = '/home/ubuntu/webdev-static-assets';
  const psdDir = path.join(assetsDir, 'psd-files');

  const imageFiles = [
    'hero-quantum-main.png',
    'about-practitioners.png',
    'services-energy-healing.png',
    'membership-benefits.png',
    'testimonials-success.png',
    'appointment-booking.png'
  ];

  it('should have all generated images in assets directory', () => {
    imageFiles.forEach(file => {
      const filePath = path.join(assetsDir, file);
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });

  it('should have editable PNG files created', () => {
    imageFiles.forEach(file => {
      const baseName = file.replace('.png', '');
      const editablePath = path.join(psdDir, `${baseName}-editable.png`);
      expect(fs.existsSync(editablePath)).toBe(true);
    });
  });

  it('should have metadata files for each image', () => {
    imageFiles.forEach(file => {
      const baseName = file.replace('.png', '');
      const metadataPath = path.join(psdDir, `${baseName}-metadata.txt`);
      expect(fs.existsSync(metadataPath)).toBe(true);
      
      // Verify metadata content
      const content = fs.readFileSync(metadataPath, 'utf-8');
      expect(content).toContain('이미지:');
      expect(content).toContain('편집 가능: 예');
    });
  });

  it('should verify image file sizes are reasonable', () => {
    imageFiles.forEach(file => {
      const filePath = path.join(assetsDir, file);
      const stats = fs.statSync(filePath);
      // Each image should be at least 1MB (high quality)
      expect(stats.size).toBeGreaterThan(1000000);
      // But not exceed 50MB
      expect(stats.size).toBeLessThan(50000000);
    });
  });

  it('should verify editable PNG files are valid', () => {
    imageFiles.forEach(file => {
      const baseName = file.replace('.png', '');
      const editablePath = path.join(psdDir, `${baseName}-editable.png`);
      const stats = fs.statSync(editablePath);
      // Editable files should be similar size to originals
      expect(stats.size).toBeGreaterThan(1000000);
    });
  });

  it('should have proper directory structure', () => {
    expect(fs.existsSync(assetsDir)).toBe(true);
    expect(fs.existsSync(psdDir)).toBe(true);
    
    const files = fs.readdirSync(psdDir);
    expect(files.length).toBeGreaterThan(0);
  });

  it('should verify image URLs are properly formatted in Home component', () => {
    const homeComponentPath = '/home/ubuntu/jangbu-quantum-assoc/client/src/pages/Home.tsx';
    const content = fs.readFileSync(homeComponentPath, 'utf-8');
    
    // Check for CDN URLs
    expect(content).toContain('d2xsxph8kpxj0f.cloudfront.net');
    expect(content).toContain('hero-quantum-main');
    expect(content).toContain('about-practitioners');
    expect(content).toContain('services-energy-healing');
    expect(content).toContain('membership-benefits');
    expect(content).toContain('testimonials-success');
    expect(content).toContain('appointment-booking');
  });

  it('should verify all image sections are properly integrated', () => {
    const homeComponentPath = '/home/ubuntu/jangbu-quantum-assoc/client/src/pages/Home.tsx';
    const content = fs.readFileSync(homeComponentPath, 'utf-8');
    
    // Verify hero section
    expect(content).toContain('hero-quantum-main');
    
    // Verify about section
    expect(content).toContain('about-practitioners');
    
    // Verify services section
    expect(content).toContain('services-energy-healing');
    
    // Verify membership section
    expect(content).toContain('membership-benefits');
    
    // Verify testimonials section
    expect(content).toContain('testimonials-success');
    
    // Verify appointment section
    expect(content).toContain('appointment-booking');
  });

  it('should verify responsive image implementation', () => {
    const homeComponentPath = '/home/ubuntu/jangbu-quantum-assoc/client/src/pages/Home.tsx';
    const content = fs.readFileSync(homeComponentPath, 'utf-8');
    
    // Check for responsive classes
    expect(content).toContain('rounded-lg');
    expect(content).toContain('shadow-2xl');
    expect(content).toContain('object-cover');
  });
});
