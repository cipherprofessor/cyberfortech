"use client"
import React from 'react'
import TopSellingCategories from '../../../components/ui/ListCardCategories/ListCardCategories'
import { mockTopSellingCourceCategories } from './mock'
import styles from "./course_dashboard.module.scss"
import { motion } from 'framer-motion'
import { courseCategories, mockStats } from '../../../components/lib/mockData'
import KPICard from '../../../components/ui/KPICard/KPICard'
import ApacheRadarChart from '@/components/charts/Apache-ECharts/ApacheRadarChart/ApacheRadarChart'
import ApacheAreaChart from '@/components/charts/Apache-ECharts/ApacheAreaChart/ApacheAreaChart'
import ListCardContainer from '../../../components/ui/ListCard/ListCardContainer'
import { ViewIcon } from 'lucide-react'


const page = () => {
  return (
    <>

<div className={styles.bentoGrid}>
          {/* Stats Section */}
          <motion.div
            className={`${styles.bentoItem} ${styles.stats}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className={styles.statsGrid}>
              {mockStats.map((stat, index) => (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <KPICard
                    title={stat.title}
                    value={stat.value}
                    change={stat.change}
                    icon={stat.icon}
                    iconType={stat.iconType}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Radar Chart */}
          <motion.div
            className={`${styles.bentoItem} ${styles.radar}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ApacheRadarChart />
          </motion.div>

          <motion.div
            className={`${styles.bentoItem} ${styles.apacheAreaChart}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ApacheAreaChart />
          </motion.div>

          {/* Categories */}
          <motion.div
            className={`${styles.bentoItem} ${styles.categoriesList}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <ListCardContainer
              categories={courseCategories}
              title="Course Categories"
              button={<ViewIcon />}
              onButtonClick={() => console.log("View all clicked")}
            />
          </motion.div>

          <motion.div
            className={`${styles.bentoItem} ${styles.cardCategories}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="p-6">
              <TopSellingCategories
                data={mockTopSellingCourceCategories}
                title="Top Selling Categories"
                showIcons={true}
                animated={true}
                sortable={true}
              />
            </div>
          </motion.div>

        
          {/* Add more bento items here */}
        </div>


    </>
   
  )
}

export default page