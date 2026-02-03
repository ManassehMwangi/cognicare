/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await hash('admin123', 12)
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  // Create regular user
  const userPassword = await hash('user123', 12)
  await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Regular User',
      password: userPassword,
      role: 'USER',
    },
  })

  // Create categories
  const examPrep = await prisma.category.upsert({
    where: { name: 'Exam Prep' },
    update: {},
    create: {
      name: 'Exam Prep',
      description: 'Study guides and practice materials for medical and nursing exams',
      image: '/images/banner2.jpg',
    },
  })

  const textbooks = await prisma.category.upsert({
    where: { name: 'Textbooks' },
    update: {},
    create: {
      name: 'Textbooks',
      description: 'Core textbooks for medical and nursing education',
      image: '/images/banner2.jpg',
    },
  })

  const clinicalResources = await prisma.category.upsert({
    where: { name: 'Clinical Resources' },
    update: {},
    create: {
      name: 'Clinical Resources',
      description: 'Clinical references and practice resources',
      image: '/images/banner3.jpg',
    },
  })

  // Create products
  // Exam Prep
  await prisma.product.upsert({
    where: { id: 'exam-prep-1' },
    update: {},
    create: {
      id: 'exam-prep-1',
      name: 'USMLE Step 1 Review Guide',
      description: 'Comprehensive review for USMLE Step 1 with practice questions and high-yield topics',
      price: 49.99,
      images: ['/images/book1.jpg', '/images/book2.jpg'],
      categoryId: examPrep.id,
      stock: 25,
    },
  })

  await prisma.product.upsert({
    where: { id: 'exam-prep-2' },
    update: {},
    create: {
      id: 'exam-prep-2',
      name: 'NCLEX-RN Practice Questions',
      description: 'Thousands of practice questions with detailed rationales for NCLEX-RN preparation',
      price: 39.99,
      images: ['/images/book3.jpg', '/images/book4.jpg'],
      categoryId: examPrep.id,
      stock: 30,
    },
  })

  // Textbooks
  await prisma.product.upsert({
    where: { id: 'textbooks-1' },
    update: {},
    create: {
      id: 'textbooks-1',
      name: 'Medical-Surgical Nursing Textbook',
      description: 'Authoritative textbook covering medical-surgical nursing concepts and care',
      price: 129.99,
      images: ['/images/book5.jpg', '/images/book6.jpg'],
      categoryId: textbooks.id,
      stock: 15,
    },
  })

  await prisma.product.upsert({
    where: { id: 'textbooks-2' },
    update: {},
    create: {
      id: 'textbooks-2',
      name: 'Anatomy & Physiology Essentials',
      description: 'Clear, illustrated guide to human anatomy and physiology for healthcare students',
      price: 79.99,
      images: ['/images/book7.jpg', '/images/book9.jpg'],
      categoryId: textbooks.id,
      stock: 20,
    },
  })

  // Clinical Resources
  await prisma.product.upsert({
    where: { id: 'clinical-1' },
    update: {},
    create: {
      id: 'clinical-1',
      name: 'Clinical Decision Making Handbook',
      description: 'Evidence-based clinical decision support for nurses and healthcare providers',
      price: 59.99,
      images: ['/images/book10.jpg', '/images/book11.jpg'],
      categoryId: clinicalResources.id,
      stock: 18,
    },
  })

  await prisma.product.upsert({
    where: { id: 'clinical-2' },
    update: {},
    create: {
      id: 'clinical-2',
      name: 'Drug Reference for Nurses',
      description: 'Quick reference for drug dosages, interactions, and nursing implications',
      price: 44.99,
      images: ['/images/bk1.jpg', '/images/book2.jpg'],
      categoryId: clinicalResources.id,
      stock: 22,
    },
  })

  console.log('Seed data created successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
