import css from '@styled-system/css';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Box } from '@/components/Box';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Stack } from '@/components/Layouts';
import { Loader } from '@/components/Loader';
import { TableContainer } from '@/components/Shared/TableComponents';
import { OrderIcon } from '@/components/Sidebar/OrderIcon';
import { Switch } from '@/components/Switch';
import { TableLoader } from '@/components/TableLoader';
import { Text } from '@/components/Text';
import {
  useInspectionReportDetails,
  useUpdateInspectionReportMutation,
} from './hooks';
import { ProductListing } from '@/models/ProductListing';
import { ImageUploadModal } from '../Shared/ImageUploadModal';
import ImageGallery from '../Shared/ImageViewer/ImageGallery';

export interface ButtonProps {
  flexBasis?: string;
}

export interface IImages {
  name?: string;
  status?: boolean;
  url?: string;
  imageUrl?: string;
}

export interface ISelectedInspection {
  itemEn: string;
  checkEn: string;
}

const CardsGrid = styled('div')(() => {
  return css({
    display: 'flex',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    marginRight: -10,
    marginLeft: -10,
  });
});

const CardItem = styled('div')<ButtonProps>((props) => {
  const { flexBasis = '24%' } = props;
  return css({
    flexBasis: flexBasis,
    padding: 10,
    '@media (max-width: 960px)': {
      flexBasis: '100%',
    },
  });
});
const CheckBoxWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: -20px;
  justify-content: space-between;
  margin-top: auto;
  margin-bottom: auto;
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  margin-right: 8px;
`;

const Label = styled.label`
  font-size: 14px;
`;

const Textarea = styled('textarea')(() => {
  return css({
    width: '100%',
    padding: '10px',
    fontSize: '14px',
    border: '2px solid #d9d9d9',
    borderRadius: '7px',
    minHeight: '100px',
    maxHeight: '200px',
    overflowY: 'auto',
    transition: 'border-color 0.3s ease',
    resize: 'none',
    margin: '10px 0 10px 0',
    '&:focus': {
      outline: 'none',
      borderColor: '#007BFF',
    },
    '&::placeholder': {
      color: '#888',
    },
  });
});

export function InspectionReport() {
  const [showImageModal, setShowImageModals] = useState<boolean>(false);
  const [selectedInspection, setSelectedInspection] =
    useState<ISelectedInspection>();
  const [reload, setReload] = useState<boolean>(true);
  const [maxImg, setMaxImg] = useState<number>(5);
  const router = useRouter();

  const { query } = router;
  const { listingId, categoryName } = query;
  const { isLoading, data } = useInspectionReportDetails(
    listingId as string,
    categoryName as string
  );

  function handleImageDelete(
    itemEn: string,
    checkEn: string,
    urlToDelete: string
  ) {
    const item = data.find((item: any) => item.nameEn === itemEn);
    const check = item?.checks.find((check: any) => check.nameEn === checkEn);

    if (check) {
      check.images = check.images?.filter(
        (image: any) => image.url !== urlToDelete
      );
      setReload(!reload);
    }
  }

  const updateInspectionReportMutation = useUpdateInspectionReportMutation();

  useEffect(() => {
    if (data) {
      const initialCheckedItems: Record<string, boolean> = {};
      const initialComments: Record<string, string> = {};

      data.forEach((item: any) => {
        item.checks.forEach(({ nameEn, status, comment = '' }: any) => {
          initialCheckedItems[nameEn] = status;
          initialComments[nameEn] = comment;
        });
      });
    }
  }, [data]);

  function handleSaveData() {
    updateInspectionReportMutation.mutate({
      listingId: listingId as string,
      categoryName: categoryName as string,
      inspectionReport: data,
    });
  }

  async function uploadImage(
    imageObject: { type: string; name: string },
    presignedUrl: string
  ): Promise<void> {
    try {
      const { status, statusText } = await axios.put(
        presignedUrl,
        imageObject,
        {
          headers: { 'Content-Type': imageObject.type },
        }
      );

      if (status !== 200) {
        console.error(
          `Failed to upload file ${imageObject.name}: ${statusText}`
        );
      }
    } catch (error) {
      console.error(`Error uploading file ${imageObject.name}:`, error);
    }
  }

  async function handleImageSave(files: File[]) {
    if (!files || files.length === 0) return;

    const { data: presignedData } = await ProductListing.getPresignedURL({
      count: files?.length?.toString(),
      fileExtension: 'png',
    });
    const urlsToUpdate = presignedData?.map((urlObject: any) => urlObject.url);

    await Promise.all(
      files.map((imageFile, index) =>
        uploadImage(imageFile, urlsToUpdate[index])
      )
    );
    const images: IImages[] = files.map((file, index) => {
      const presignURL: any = presignedData[index];
      const imageUrl: string | undefined =
        presignURL?.cdn && presignURL?.path
          ? `${presignURL.cdn}/${presignURL.path}`
          : undefined;

      return {
        name: file.name,
        status: Boolean(imageUrl),
        url: imageUrl,
        imageUrl: presignURL?.path,
      };
    });

    data.forEach((item: any) => {
      if (item.nameEn === selectedInspection?.itemEn) {
        item.checks.forEach((check: any) => {
          if (check.nameEn === selectedInspection?.checkEn) {
            check.images = [...(check.images || []), ...images];
          }
        });
      }
    });

    setShowImageModals(false);
  }

  const toggleClickHandler = (event: any) => {
    const inspectionType = event.target.getAttribute('data-inspection-type');
    const checkId = event.target.getAttribute('id');
    const selectedItem = data.find(
      (item: any) => item.nameEn === inspectionType
    );

    if (selectedItem) {
      const selectedCheck = selectedItem.checks.find(
        (check: any) => check.nameEn === checkId
      );

      if (selectedCheck) {
        selectedCheck.status = event.target.checked;
      }
    }
    setReload(!reload);
  };

  function toggleCheckHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const inspectionType = event.target.getAttribute('data-inspection-type');
    const checkId = event.target.id;
    const isChecked = event.target.checked;

    data.forEach((item: any) => {
      if (item.nameEn === inspectionType) {
        const check = item.checks.find(
          (check: any) => check.nameEn === checkId
        );

        if (check) check.showInSPP = isChecked;
      }
    });
  }

  const handleOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inspectionType = event.target.getAttribute('data-inspection-type');
    const checkId = event.target.id;
    const commentValue = event.target.value;

    data.forEach((item: any) => {
      if (item.nameEn === inspectionType) {
        const check = item.checks.find(
          (check: any) => check.nameEn === checkId
        );

        if (check) check.comment = commentValue;
      }
    });
    setReload(!reload);
  };

  if (isLoading)
    return (
      <TableContainer>
        <TableLoader />
      </TableContainer>
    );
  return (
    <>
      <Stack direction="horizontal" gap="10" justify="space-between">
        <Text
          fontWeight="bigSubtitle"
          fontSize="headingThree"
          color="static.black"
        >
          Inspection Report {categoryName}
        </Text>
        <Button
          variant="filled"
          onClick={handleSaveData}
          disabled={isLoading || data.length === 0}
        >
          {isLoading && <Loader size="12px" border="static.blue" />} Save
        </Button>
      </Stack>
      <CardsGrid>
        {data.map((item: any) => (
          <CardItem flexBasis="30%" key={item.nameEn}>
            <Card
              heading={`${item.nameEn} ${item.nameAr}`}
              icon={<OrderIcon />}
            >
              {/* Order Details - Start */}
              <Stack direction="vertical" key={item.nameEn} gap="12">
                {item.checks.map((check: any) => (
                  <>
                    <Stack
                      direction="horizontal"
                      gap="2"
                      justify="space-between"
                      key={check.nameEn}
                    >
                      <Box>
                        <Stack direction="vertical" gap="4">
                          <Text
                            fontWeight="regular"
                            fontSize="baseText"
                            color="static.grays.500"
                          >
                            {check.nameEn} {check.nameAr}
                          </Text>
                        </Stack>
                      </Box>
                      <Box>
                        <Switch
                          data-inspection-type={item.nameEn}
                          id={check.nameEn}
                          defaultOn={check.status}
                          onClick={toggleClickHandler}
                        />
                      </Box>
                    </Stack>
                    <Box cssProps={{ borderBottom: '1px solid #d9d9d9' }}>
                      <CheckBoxWrapper>
                        <CheckBoxWrapper>
                          <Checkbox
                            onChange={toggleCheckHandler}
                            data-inspection-type={item.nameEn}
                            id={check.nameEn}
                            defaultChecked={check.showInSPP}
                          />
                          <Label>Show in SPP</Label>
                        </CheckBoxWrapper>
                        <Button
                          variant="filled"
                          onClick={() => {
                            setShowImageModals(true);
                            setSelectedInspection({
                              itemEn: item?.nameEn,
                              checkEn: check?.nameEn,
                            });
                            setMaxImg(5 - check?.images?.length || 0);
                          }}
                          disabled={false}
                          style={{ padding: '4px', fontSize: '12px' }}
                        >
                          Upload photo
                        </Button>
                      </CheckBoxWrapper>
                      {!check?.status && (
                        <Textarea
                          id={check.nameEn}
                          data-inspection-type={item.nameEn}
                          onChange={handleOnChange}
                          placeholder="Write a reason here"
                          value={check?.comment || ''}
                          maxLength={75}
                        />
                      )}
                      {check?.images?.length > 0 ? (
                        <ImageGallery
                          initialImages={check?.images?.map(
                            (image: any) => image?.url
                          )}
                          onDelete={handleImageDelete}
                          checkEn={check?.nameEn}
                          itemEn={item?.nameEn}
                        />
                      ) : null}
                    </Box>
                  </>
                ))}
              </Stack>
            </Card>
          </CardItem>
        ))}
        <ImageUploadModal
          isOpen={showImageModal}
          onClose={() => setShowImageModals(false)}
          onSave={handleImageSave}
          isLoading={false}
          maxFiles={maxImg || 5}
        />
      </CardsGrid>
    </>
  );
}
