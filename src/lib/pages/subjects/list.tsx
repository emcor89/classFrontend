import { CreateButton } from '@/components/refine-ui/buttons/create'
import { DataTable } from '@/components/refine-ui/data-table/data-table'
import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb'
import { ListView } from '@/components/refine-ui/views/list-view'
import { SelectItem, SelectTrigger } from '@/components/ui/select'
import { DEPARTEMENTS_OPTIONS } from '@/constants'
import { Subject } from '@/typs'
import { Select, SelectContent, SelectValue } from '@radix-ui/react-select'
import { useTable } from '@refinedev/react-table'
import { ColumnDef } from '@tanstack/react-table'
import { Badge, Search } from 'lucide-react'
import React, { useMemo } from 'react'

const SubjectList = () => {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedDepartment, setSelectedDepartment] = React.useState('all')  

  const deprartmentFilter = selectedDepartment !== 'all' ? [] : [
    { field: 'department', operator: 'eq' as const, value: selectedDepartment }
  ]
  const searchFilter = searchQuery ? [
    { field: 'name', operator: 'contains' as const, value: searchQuery }
  ] : [];

  const subjectTable = useTable<Subject>({
    columns:useMemo<ColumnDef<Subject>[]>(() => [
      {
        id: 'code',
        accessorKey: 'code',
        size: 100,
        header: () => <p className='column-title ml-2'>Code</p>,
        cell:({getValue}) => <Badge>{getValue<string>()}</Badge>
      },
      {
        id: 'name',
        accessorKey: 'name',
        size: 200,
        header: () => <p className='column-title'>Name</p>,
        cell:({getValue}) => <span className='text-foreground'>{getValue<string>()}</span>,
        filterFn: 'includesString'
      },
      {
        id: 'department',
        accessorKey: 'department',
        size: 150,
        header: () => <p className='column-title'>Department</p>,
        cell:({getValue}) => <Badge fontVariant="secondary">{getValue<string>()}</Badge>,
      },
      {
        id: 'description',
        accessorKey: 'description',
        size: 300,
        header: () => <p className='column-title'>Description</p>,
        cell:({getValue}) => <span className='truncate line-clamp-2'>{getValue<string>()}</span>
      }
      
    ], []),
    refineCoreProps: {
      resource: 'subjects',
      pagination: {pageSize: 10, mode: 'server',},
      filters: {
        permanent: [...deprartmentFilter, ...searchFilter],
      },
      sorters: {
        initial: [
          { field: 'id', order: 'desc'}
        ]
      },
    }
     
  });

  return (
    <ListView>
      <Breadcrumb />
      <h1 className='page-title'>Subjects</h1>
      <div className='intro-row'>
        <p>Quick access to essential metrics and management tools</p>
        <div className='actions-row'>
          <div className='search-field'>
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search bye name ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className='flex gap-2 w-full sm:w-auto'>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {DEPARTEMENTS_OPTIONS.map((department) => (
                  <SelectItem key={department.value} value={department.value}>
                    {department.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <CreateButton />
          </div>
        </div>
      </div>
      <DataTable table={subjectTable} />
    </ListView>
  )
}

export default SubjectList