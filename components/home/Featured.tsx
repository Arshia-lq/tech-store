"use client";

import Products from '../Products'
import Categories from '../Categories'
import { useState } from 'react';

export const Featured = () => {
  const [category, setCategory] = useState("All")

  return (
    <section className="mx-auto max-w-[1600px] px-6 py-20 lg:px-8">
      <h2 className="text-center text-sm font-bold uppercase tracking-widest text-gray-900">
        Featured Categories
      </h2>
      <div className="mt-6">
        <Categories setCategory={setCategory} selectedCategory={category} />
      </div>

      <div className="mt-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className='pt-12 pb-5'>
            <h3 className="text-2xl font-bold text-gray-900 lg:text-3xl">
              Featured <span className="italic text-green-500">Products</span>
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Check & Select Your Desired Product!
            </p>
          </div>
        </div>
        <div className="mt-6">
          <Products category={category} />
        </div>
      </div>
    </section>
  )
}
