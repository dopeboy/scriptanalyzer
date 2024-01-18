"use client"
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { getAPIURL } from '@/lib/api'
import { Skeleton } from '@/components/Skeleton'
import Link from 'next/link'


export default function Scripts() {
  const router = useRouter()
  const [data, setData] = useState([])
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${getAPIURL()}/scripts`)
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        setLoading(false)
      })
  }, [])
  
  if (!isLoading && data.length === 0) {
    return "No scripts, sad face"
  }

  return (
    <>
      <div className="flex items-center mb-8">
        <div className="w-3/5">
          <h1 className="text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-4xl">Scripts</h1>
        </div>
        <div className="w-2/5">
          <button className="float-right bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded w-48 rounded-lg" onClick={() => router.push('/script')}>
            New Script
          </button>
        </div>
      </div>
      {isLoading && <Skeleton />}
      {!isLoading && data &&
        <div className="relative overflow-x-auto">
          <table className="w-full bg-gray-50 text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Script name
                </th>
                <th scope="col" className="px-6 py-3">
                  Created on
                </th>
                <th scope="col" className="px-6 py-3">
                  Alerts
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((script: any) =>
                <tr className="bg-white border-b">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    <Link className="md:hover:text-blue-8700" href={`/script/${script.id}`}>{script.name}</Link>
                  </th>
                  <td className="px-6 py-4">
                    {new Date(script.created_on).toLocaleDateString('en-us')}
                  </td>
                  <td className="px-6 py-4">
                    -
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      }
    </>
  )
}
