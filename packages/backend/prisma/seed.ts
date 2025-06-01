import { PrismaClient, UserRole, JobType, JobStatus, BidStatus, VehicleType } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create sample users
  const hashedPassword = await hash('password123', 10);

  // Create customers
  const customers = await Promise.all([
    prisma.user.upsert({
      where: { email: 'john.customer@example.com' },
      update: {},
      create: {
        email: 'john.customer@example.com',
        password: hashedPassword,
        name: 'John Customer',
        role: UserRole.CUSTOMER,
        phone: '+1-555-0101',
        address: '123 Main St, New York, NY 10001',
        rating: 4.5,
        totalRatings: 12,
        isVerified: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'sarah.buyer@example.com' },
      update: {},
      create: {
        email: 'sarah.buyer@example.com',
        password: hashedPassword,
        name: 'Sarah Buyer',
        role: UserRole.CUSTOMER,
        phone: '+1-555-0102',
        address: '456 Oak Ave, Los Angeles, CA 90210',
        rating: 4.8,
        totalRatings: 8,
        isVerified: true,
      },
    }),
  ]);

  // Create companies
  const companies = await Promise.all([
    prisma.user.upsert({
      where: { email: 'logistics@acmecorp.com' },
      update: {},
      create: {
        email: 'logistics@acmecorp.com',
        password: hashedPassword,
        name: 'Mike Johnson',
        role: UserRole.COMPANY,
        phone: '+1-555-0201',
        address: '789 Business Blvd, Chicago, IL 60601',
        companyName: 'ACME Corporation',
        companyLicense: 'LIC-12345',
        rating: 4.2,
        totalRatings: 25,
        isVerified: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'shipping@techstartup.com' },
      update: {},
      create: {
        email: 'shipping@techstartup.com',
        password: hashedPassword,
        name: 'Lisa Chen',
        role: UserRole.COMPANY,
        phone: '+1-555-0202',
        address: '321 Innovation Dr, Austin, TX 78701',
        companyName: 'TechStartup Inc',
        companyLicense: 'LIC-67890',
        rating: 4.6,
        totalRatings: 15,
        isVerified: true,
      },
    }),
  ]);

  // Create transporters
  const transporters = await Promise.all([
    prisma.user.upsert({
      where: { email: 'driver1@transport.com' },
      update: {},
      create: {
        email: 'driver1@transport.com',
        password: hashedPassword,
        name: 'Carlos Rodriguez',
        role: UserRole.TRANSPORTER,
        phone: '+1-555-0301',
        address: '555 Highway Rd, Miami, FL 33101',
        rating: 4.9,
        totalRatings: 47,
        isVerified: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'driver2@transport.com' },
      update: {},
      create: {
        email: 'driver2@transport.com',
        password: hashedPassword,
        name: 'Emma Wilson',
        role: UserRole.TRANSPORTER,
        phone: '+1-555-0302',
        address: '777 Freight St, Denver, CO 80201',
        rating: 4.7,
        totalRatings: 33,
        isVerified: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'driver3@transport.com' },
      update: {},
      create: {
        email: 'driver3@transport.com',
        password: hashedPassword,
        name: 'David Park',
        role: UserRole.TRANSPORTER,
        phone: '+1-555-0303',
        address: '999 Delivery Ave, Seattle, WA 98101',
        rating: 4.3,
        totalRatings: 21,
        isVerified: true,
      },
    }),
  ]);

  // Create vehicles for transporters
  const vehicles = await Promise.all([
    prisma.vehicle.create({
      data: {
        userId: transporters[0].id,
        type: VehicleType.LARGE_TRUCK,
        make: 'Freightliner',
        model: 'Cascadia',
        year: 2020,
        licensePlate: 'TRK-001',
        capacity: '5000kg, 40 cubic meters',
        description: 'Large cargo truck suitable for heavy deliveries',
        isActive: true,
      },
    }),
    prisma.vehicle.create({
      data: {
        userId: transporters[0].id,
        type: VehicleType.VAN,
        make: 'Mercedes',
        model: 'Sprinter',
        year: 2019,
        licensePlate: 'VAN-002',
        capacity: '1500kg, 15 cubic meters',
        description: 'Medium van for city deliveries',
        isActive: true,
      },
    }),
    prisma.vehicle.create({
      data: {
        userId: transporters[1].id,
        type: VehicleType.MEDIUM_TRUCK,
        make: 'Isuzu',
        model: 'NPR',
        year: 2021,
        licensePlate: 'TRK-003',
        capacity: '3000kg, 25 cubic meters',
        description: 'Medium truck for regional deliveries',
        isActive: true,
      },
    }),
    prisma.vehicle.create({
      data: {
        userId: transporters[2].id,
        type: VehicleType.SMALL_TRUCK,
        make: 'Ford',
        model: 'Transit',
        year: 2022,
        licensePlate: 'TRK-004',
        capacity: '1200kg, 12 cubic meters',
        description: 'Small truck for quick deliveries',
        isActive: true,
      },
    }),
  ]);

  // Create jobs
  const jobs = await Promise.all([
    // Standard job from customer
    prisma.job.create({
      data: {
        posterId: customers[0].id,
        title: 'Furniture Delivery - Sofa and Coffee Table',
        description: 'Need to move a large sofa and coffee table from furniture store to my apartment. Items are already packed and ready for pickup.',
        type: JobType.STANDARD,
        status: JobStatus.OPEN_FOR_BIDS,
        pickupLocation: '123 Furniture Store St, New York, NY',
        pickupLatitude: 40.7128,
        pickupLongitude: -74.0060,
        pickupDateTime: new Date('2024-12-15T10:00:00Z'),
        deliveryLocation: '123 Main St, New York, NY 10001',
        deliveryLatitude: 40.7589,
        deliveryLongitude: -73.9851,
        deliveryDateTime: new Date('2024-12-15T14:00:00Z'),
        itemType: 'Furniture',
        weight: 150.0,
        dimensions: '2m x 1m x 1m',
        isFragile: true,
        fixedPrice: 120.00,
        currency: 'USD',
        expiresAt: new Date('2024-12-20T23:59:59Z'),
      },
    }),
    
    // Auction job from company
    prisma.job.create({
      data: {
        posterId: companies[0].id,
        title: 'Electronics Shipment - Los Angeles to Chicago',
        description: 'Urgent shipment of electronic components for manufacturing. Temperature controlled transport required.',
        type: JobType.AUCTION,
        status: JobStatus.OPEN_FOR_BIDS,
        pickupLocation: 'ACME Warehouse, Los Angeles, CA',
        pickupLatitude: 34.0522,
        pickupLongitude: -118.2437,
        pickupDateTime: new Date('2024-12-18T08:00:00Z'),
        deliveryLocation: 'Manufacturing Plant, Chicago, IL',
        deliveryLatitude: 41.8781,
        deliveryLongitude: -87.6298,
        deliveryDateTime: new Date('2024-12-20T17:00:00Z'),
        itemType: 'Electronics',
        weight: 500.0,
        dimensions: '3m x 2m x 1.5m',
        isFragile: true,
        specialRequirements: 'Temperature controlled (15-25°C), shock resistant packaging',
        startingBid: 800.00,
        maxBudget: 1200.00,
        currency: 'USD',
        biddingEndsAt: new Date('2024-12-16T23:59:59Z'),
        expiresAt: new Date('2024-12-21T23:59:59Z'),
      },
    }),

    // Assigned job
    prisma.job.create({
      data: {
        posterId: customers[1].id,
        transporterId: transporters[0].id,
        vehicleId: vehicles[0].id,
        title: 'Office Equipment Move',
        description: 'Moving office equipment including desks, chairs, and computers to new office location.',
        type: JobType.STANDARD,
        status: JobStatus.IN_TRANSIT,
        pickupLocation: '456 Oak Ave, Los Angeles, CA',
        pickupLatitude: 34.0522,
        pickupLongitude: -118.2437,
        pickupDateTime: new Date('2024-12-10T09:00:00Z'),
        deliveryLocation: '789 New Office Blvd, Los Angeles, CA',
        deliveryLatitude: 34.0689,
        deliveryLongitude: -118.2445,
        deliveryDateTime: new Date('2024-12-10T15:00:00Z'),
        itemType: 'Office Equipment',
        weight: 300.0,
        dimensions: 'Multiple boxes and furniture pieces',
        fixedPrice: 200.00,
        currency: 'USD',
      },
    }),

    // Delivered job
    prisma.job.create({
      data: {
        posterId: companies[1].id,
        transporterId: transporters[1].id,
        vehicleId: vehicles[2].id,
        title: 'Server Equipment Delivery',
        description: 'Delivery of sensitive server equipment to data center. Requires careful handling.',
        type: JobType.STANDARD,
        status: JobStatus.DELIVERED,
        pickupLocation: 'TechStartup Inc, Austin, TX',
        pickupLatitude: 30.2672,
        pickupLongitude: -97.7431,
        pickupDateTime: new Date('2024-12-05T14:00:00Z'),
        deliveryLocation: 'Data Center, Dallas, TX',
        deliveryLatitude: 32.7767,
        deliveryLongitude: -96.7970,
        deliveryDateTime: new Date('2024-12-06T10:00:00Z'),
        itemType: 'Server Equipment',
        weight: 80.0,
        dimensions: '1m x 0.5m x 0.3m',
        isFragile: true,
        specialRequirements: 'Anti-static packaging, upright transport only',
        fixedPrice: 350.00,
        currency: 'USD',
      },
    }),

    // Another auction job
    prisma.job.create({
      data: {
        posterId: customers[0].id,
        title: 'Artwork Transport - Gallery to Home',
        description: 'Transport of valuable artwork from gallery to private residence. White glove service required.',
        type: JobType.AUCTION,
        status: JobStatus.PENDING,
        pickupLocation: 'Art Gallery, New York, NY',
        pickupLatitude: 40.7614,
        pickupLongitude: -73.9776,
        pickupDateTime: new Date('2024-12-22T11:00:00Z'),
        deliveryLocation: '123 Main St, New York, NY 10001',
        deliveryLatitude: 40.7589,
        deliveryLongitude: -73.9851,
        deliveryDateTime: new Date('2024-12-22T16:00:00Z'),
        itemType: 'Artwork',
        weight: 25.0,
        dimensions: '1.5m x 1m x 0.1m',
        isFragile: true,
        specialRequirements: 'Climate controlled, white glove service, insurance required',
        startingBid: 150.00,
        maxBudget: 400.00,
        currency: 'USD',
        biddingEndsAt: new Date('2024-12-20T23:59:59Z'),
        expiresAt: new Date('2024-12-23T23:59:59Z'),
      },
    }),
  ]);

  // Create bids for auction jobs
  const bids = await Promise.all([
    // Bids for the electronics shipment
    prisma.bid.create({
      data: {
        jobId: jobs[1].id, // Electronics shipment
        transporterId: transporters[0].id,
        amount: 950.00,
        message: 'I have experience with temperature-controlled transport and can guarantee safe delivery.',
        estimatedDelivery: new Date('2024-12-20T16:00:00Z'),
        status: BidStatus.PENDING,
      },
    }),
    prisma.bid.create({
      data: {
        jobId: jobs[1].id,
        transporterId: transporters[1].id,
        amount: 875.00,
        message: 'Specialized in electronics transport with climate control. Can deliver ahead of schedule.',
        estimatedDelivery: new Date('2024-12-20T14:00:00Z'),
        status: BidStatus.PENDING,
      },
    }),
    prisma.bid.create({
      data: {
        jobId: jobs[1].id,
        transporterId: transporters[2].id,
        amount: 1050.00,
        message: 'Premium service with real-time tracking and insurance included.',
        estimatedDelivery: new Date('2024-12-20T17:00:00Z'),
        status: BidStatus.PENDING,
      },
    }),

    // Bids for the artwork transport
    prisma.bid.create({
      data: {
        jobId: jobs[4].id, // Artwork transport
        transporterId: transporters[0].id,
        amount: 320.00,
        message: 'White glove service specialist with art handling certification.',
        estimatedDelivery: new Date('2024-12-22T15:30:00Z'),
        status: BidStatus.PENDING,
      },
    }),
    prisma.bid.create({
      data: {
        jobId: jobs[4].id,
        transporterId: transporters[1].id,
        amount: 280.00,
        message: 'Experienced in fine art transport with climate-controlled vehicle.',
        estimatedDelivery: new Date('2024-12-22T16:00:00Z'),
        status: BidStatus.PENDING,
      },
    }),
  ]);

  // Create tracking updates for in-transit job
  await prisma.trackingUpdate.create({
    data: {
      jobId: jobs[2].id, // Office equipment move
      transporterId: transporters[0].id,
      location: 'Warehouse District, Los Angeles, CA',
      latitude: 34.0522,
      longitude: -118.2437,
      status: 'Picked up items, heading to destination',
      message: 'All items loaded successfully. ETA: 3:00 PM',
    },
  });

  // Create some reviews
  await Promise.all([
    prisma.review.create({
      data: {
        jobId: jobs[3].id, // Delivered server equipment job
        authorId: companies[1].id,
        recipientId: transporters[1].id,
        rating: 5,
        comment: 'Excellent service! Equipment arrived safely and on time. Highly recommended.',
      },
    }),
    prisma.review.create({
      data: {
        jobId: jobs[3].id,
        authorId: transporters[1].id,
        recipientId: companies[1].id,
        rating: 5,
        comment: 'Great customer, clear instructions and prompt payment.',
      },
    }),
  ]);

  // Create notifications
  await Promise.all([
    prisma.notification.create({
      data: {
        userId: transporters[0].id,
        type: 'NEW_JOB',
        title: 'New Job Available',
        message: 'A new furniture delivery job has been posted in your area.',
        jobId: jobs[0].id,
        isRead: false,
      },
    }),
    prisma.notification.create({
      data: {
        userId: companies[0].id,
        type: 'BID_RECEIVED',
        title: 'New Bid Received',
        message: 'You have received a new bid for your electronics shipment.',
        jobId: jobs[1].id,
        isRead: false,
      },
    }),
    prisma.notification.create({
      data: {
        userId: customers[1].id,
        type: 'JOB_COMPLETED',
        title: 'Job Completed',
        message: 'Your office equipment move has been completed successfully.',
        jobId: jobs[2].id,
        isRead: true,
      },
    }),
  ]);

  console.log('✅ Database seeded successfully!');
  console.log('\n🔐 Test Accounts Created:');
  console.log('\n👤 Customers:');
  console.log('  Email: john.customer@example.com');
  console.log('  Email: sarah.buyer@example.com');
  console.log('\n🏢 Companies:');
  console.log('  Email: logistics@acmecorp.com (ACME Corporation)');
  console.log('  Email: shipping@techstartup.com (TechStartup Inc)');
  console.log('\n🚛 Transporters:');
  console.log('  Email: driver1@transport.com (Carlos Rodriguez)');
  console.log('  Email: driver2@transport.com (Emma Wilson)');
  console.log('  Email: driver3@transport.com (David Park)');
  console.log('\n🔑 Password for all accounts: password123');
  console.log('\n📊 Created:');
  console.log(`  - ${customers.length + companies.length + transporters.length} Users`);
  console.log(`  - ${vehicles.length} Vehicles`);
  console.log(`  - ${jobs.length} Jobs`);
  console.log(`  - ${bids.length} Bids`);
  console.log('  - 1 Tracking Update');
  console.log('  - 2 Reviews');
  console.log('  - 3 Notifications');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 