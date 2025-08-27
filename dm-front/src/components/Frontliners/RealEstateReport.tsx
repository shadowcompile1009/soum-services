import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';

import { Card } from '@/components/Card';
import { TableContainer } from '@/components/Shared/TableComponents';
import { OrderIcon } from '@/components/Sidebar/OrderIcon';
import { TableLoader } from '@/components/TableLoader';

import FormField from './FormField';
import { useUpdateRealEstateInspectionReportMutation } from './hooks';
import { useRealEstateInspectionReportDetails } from './hooks/useInspectionReportDetails';
import LabelWithIcon from './LabelWithIcon';

const Container = styled.div`
  display: flex;
`;

const Sidebar = styled.div`
  padding: 20px;
  width: 200px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: rgba(0, 0, 0, 0.03) 0px 2px 4px, rgba(0, 0, 0, 0.07) 0px 20px 40px;
`;

const Content = styled.div`
  flex-grow: 1;
  padding: 20px;
`;

const Footer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 34px;
`;

const SaveButton = styled.button`
  width: 60%;
  height: 50px;
  max-width: 625px;
  color: white;
  background-color: #177ae2;
  border-radius: 5px;
  border: none;
`;

interface SidebarProps {
  selected: boolean;
}
const SidebarItem = styled.div<SidebarProps>`
  padding: 10px 0;
  cursor: pointer;
  background-color: ${({ selected }) => (selected ? '#d0eaff' : 'transparent')};
  &:hover {
    background-color: ${({ selected }) => (selected ? 'b0d6ff' : '#f0f0f0')};
  }
`;

interface RealEstateReportProps {
  listingId: string | string[] | undefined;
}
const RealEstateReport = (props: RealEstateReportProps) => {
  const { listingId } = props;
  const [activeTab, setActiveTab] = useState('');
  const [selectedSpec, setSelectedSpec] = useState<any>(null);
  const [reportData, setReportData] = useState<any>([]);
  const mutation = useUpdateRealEstateInspectionReportMutation();
  const { isLoading, data } = useRealEstateInspectionReportDetails(
    listingId as string
  );
  useEffect(() => {
    if (data) {
      setActiveTab(data[0]?.nameEn);
      setReportData(data);
    }
  }, [data])
  useEffect(() => {
    setSelectedSpec(data?.filter((tab: any) => tab.nameEn === activeTab)?.[0]);
  }, [activeTab]);

  function toggleClickHandler(event: any) {
    const newData = [...reportData];
    for (const item of data) {
      if (item.nameEn === event.target.getAttribute('data-inspection-type')) {
        for (const check of item.checks) {
          if (check.nameEn === event.target.getAttribute('id')) {
            check.status = event.target.checked;
          }
        }
      }
    }
    setReportData(newData);
  }

  function handleInputChange(event: any) {
    const { name, value } = event.target;
    const newData = [...reportData];
    for (const item of newData) {
      for (const check of item.checks) {
        if (check.nameEn === name) {
          check.value = value;
        }
      }
    }
    setReportData(newData);
  }

  function handleSaveData() {
    mutation.mutate({
      listingId: listingId as string,
      categoryName: 'Real Estate',
      inspectionReport: reportData,
    });
  }

  if (isLoading) {
    return (
      <TableContainer>
        <TableLoader />
      </TableContainer>
    );
  }

  return (
    <>
      <Container>
        <Sidebar>
          {data?.map((tab: any) => (
            <SidebarItem
              key={tab.nameEn}
              onClick={() => setActiveTab(tab.nameEn)}
              selected={activeTab == tab.nameEn}
            >
              <LabelWithIcon
                icon={tab.icon ? (
                  <Image
                    src={tab.icon}
                    width={24}
                    height={24}
                    alt=''
                  />
                ) : (
                  <OrderIcon />
                )}
                enLabel={tab.nameEn}
                arLabel={tab.nameAr}
                active={activeTab == tab.nameEn}
              />
            </SidebarItem>
          ))}
        </Sidebar>
        <Content>
          <Card heading={selectedSpec?.nameEn}>
            {selectedSpec?.checks.map((item: any) => (
              <FormField key={selectedSpec?.nameEn + item.nameEn} group={selectedSpec?.nameEn} enLabel={item.nameEn} arLabel={item.nameAr} status={item.status} toggleClickHandler={toggleClickHandler} value={item.value} handleInputChange={handleInputChange} />
            ))}
          </Card>
        </Content>
      </Container>

      <Footer>
        <SaveButton onClick={handleSaveData}>Save</SaveButton>
      </Footer>
    </>
  );
};

export default RealEstateReport;
