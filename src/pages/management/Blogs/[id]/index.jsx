// src/pages/management/blogs/EditBlog.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Text,
  Divider,
  Badge,
  Image,
  useToast,
  Textarea,
  Grid,
  GridItem,
  Stack,
  Tag,
  TagLabel,
  Icon,
  HStack,
  Spinner,
  useColorModeValue,
} from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';

// CKEditor imports
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FiChevronLeft,
  FiSave,
  FiImage,
  FiSettings,
  FiFileText,
} from 'react-icons/fi';

const baseUrl = process.env.REACT_APP_APIURL || 'http://localhost:8000/v1';
const apiRoot = baseUrl.replace(/\/v1$/, '');

const EditBlog = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm();

  const { id } = useParams(); // /admin/blogs/:id
  const navigate = useNavigate();
  const toast = useToast();

  const pageBg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const subtleText = useColorModeValue('gray.500', 'gray.400');

  const [featurePreview, setFeaturePreview] = useState(null);
  const [loading, setLoading] = useState(true);

  const mainHeadingWatch = watch('mainHeading') || 'Blog main heading';
  const slugWatch = watch('slug') || '';
  const introWatch = watch('introParagraph') || '';
  const conclusionWatch = watch('conclusion') || '';

  // For EDIT, featureImage is OPTIONAL
  const featureImageRegister = register('featureImage');

  const editorConfig = {
    toolbar: [
      'heading',
      '|',
      'bold',
      'italic',
      'underline',
      'link',
      '|',
      'bulletedList',
      'numberedList',
      '|',
      'undo',
      'redo',
    ],
  };

  // 🔹 Fetch existing blog data on mount
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const token =
          localStorage.getItem('authToken') ||
          sessionStorage.getItem('authToken');

        if (!token) {
          toast({
            title: 'Not logged in',
            description: 'Please login as admin to edit the blog.',
            status: 'warning',
            duration: 3000,
            isClosable: true,
            position: 'bottom-right',
          });
          navigate('/login');
          return;
        }

        const res = await axios.get(`${baseUrl}/myblogs/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const blog = res.data;

        // Prefill form fields
        reset({
          mainHeading: blog.mainHeading || '',
          slug: blog.slug || '',
          introParagraph: blog.introParagraph || '',
          heading2: blog.heading2 || '',
          body2: blog.body2 || '',
          heading3: blog.heading3 || '',
          body3: blog.body3 || '',
          heading4: blog.heading4 || '',
          body4: blog.body4 || '',
          heading5: blog.heading5 || '',
          body5: blog.body5 || '',
          conclusion: blog.conclusion || '',
          seoTitle: blog.seoTitle || '',
          seoDescription: blog.seoDescription || '',
          metaTitle: blog.metaTitle || '',
          metaDescription: blog.metaDescription || '',
          keywords: blog.keywords || '',
          schemaMarkup: blog.schemaMarkup || '',
        });

        // Existing feature image preview
        if (blog.featureImage) {
          setFeaturePreview(`${apiRoot}${blog.featureImage}`);
        }
      } catch (err) {
        console.error('Error loading blog:', err);
        toast({
          title: 'Error loading blog',
          description:
            err.response?.data?.message ||
            'Failed to fetch blog data. Please try again.',
          status: 'error',
          duration: 4000,
          isClosable: true,
          position: 'bottom-right',
        });
        navigate('/admin/blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onSubmit = async (data) => {
    const formData = new FormData();

    // BASIC FIELDS
    formData.append('mainHeading', data.mainHeading || '');
    formData.append('slug', data.slug || '');
    formData.append('introParagraph', data.introParagraph || '');

    // SECTIONS
    formData.append('heading2', data.heading2 || '');
    formData.append('body2', data.body2 || '');
    formData.append('heading3', data.heading3 || '');
    formData.append('body3', data.body3 || '');
    formData.append('heading4', data.heading4 || '');
    formData.append('body4', data.body4 || '');
    formData.append('heading5', data.heading5 || '');
    formData.append('body5', data.body5 || '');

    // CONCLUSION
    formData.append('conclusion', data.conclusion || '');

    // SEO
    formData.append('seoTitle', data.seoTitle || '');
    formData.append('seoDescription', data.seoDescription || '');
    formData.append('metaTitle', data.metaTitle || '');
    formData.append('metaDescription', data.metaDescription || '');
    formData.append('keywords', data.keywords || '');
    formData.append('schemaMarkup', data.schemaMarkup || '');

    // IMAGES
    // Only send new feature image if user selected one
    if (data.featureImage && data.featureImage[0]) {
      formData.append('featureImage', data.featureImage[0]);
    }
    // Only send new gallery images if selected
    if (data.galleryImages && data.galleryImages.length > 0) {
      Array.from(data.galleryImages).forEach((file) => {
        formData.append('galleryImages', file);
      });
    }

    try {
      const token =
        localStorage.getItem('authToken') ||
        sessionStorage.getItem('authToken');

      if (!token) {
        toast({
          title: 'Not logged in',
          description: 'Please login again.',
          status: 'warning',
          duration: 3000,
          isClosable: true,
          position: 'bottom-right',
        });
        navigate('/login');
        return;
      }

      await axios.put(`${baseUrl}/myblogs/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast({
        title: 'Blog updated',
        description: 'Your blog has been updated successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'bottom-right',
      });

      navigate('/admin/blogs');
    } catch (err) {
      console.error('Update blog error:', err);
      toast({
        title: 'Error',
        description:
          err?.response?.data?.message ||
          'Something went wrong while updating the blog.',
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  if (loading) {
    return (
      <Box
        bg={pageBg}
        pt={{ base: '140px', md: '110px' }}
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner size="lg" />
      </Box>
    );
  }

  return (
    <Box
      bg={pageBg}
      pt={{ base: '140px', md: '110px' }}
      minH="100vh"
      position="relative"
      _before={{
        content: '""',
        position: 'fixed',
        inset: 0,
        opacity: 0.3,
        zIndex: -1,
      }}
    >
      <Box maxW="1300px" mx="auto" px={{ base: 4, md: 6, lg: 8 }} pb={10}>
        {/* Top Bar */}
        <Flex justify="space-between" align="center" mb={5}>
          <HStack spacing={3}>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<FiChevronLeft />}
              onClick={() => navigate(-1)}
              borderRadius="full"
            >
              Back
            </Button>

            <Tag
              size="sm"
              borderRadius="full"
              variant="subtle"
              colorScheme="pink"
            >
              <TagLabel>HOI Blog Studio</TagLabel>
            </Tag>
          </HStack>

          <HStack spacing={3}>
            <Text fontSize="xs" color={subtleText}>
              Editing mode · Changes apply on save
            </Text>
          </HStack>
        </Flex>

        {/* Page Header */}
        <Flex
          justify="space-between"
          align={{ base: 'flex-start', md: 'center' }}
          direction={{ base: 'column', md: 'row' }}
          gap={3}
          mb={7}
        >
          <Box>
            <Heading size="lg" mb={1}>
              Edit Blog
            </Heading>
            <Text fontSize="sm" color={subtleText} maxW="600px">
              Update your HOI blog content, images, and SEO settings using the
              same editor layout as Add Blog.
            </Text>
          </Box>

          <Button
            leftIcon={<FiSave />}
            colorScheme="purple"
            variant="solid"
            borderRadius="full"
            px={6}
            size="sm"
            onClick={handleSubmit(onSubmit)}
            isLoading={isSubmitting}
          >
            Save Changes
          </Button>
        </Flex>

        {/* Main Layout */}
        <Grid
          templateColumns={{
            base: '1fr',
            lg: 'minmax(0, 2.1fr) minmax(0, 1.2fr)',
          }}
          gap={6}
          alignItems="flex-start"
        >
          {/* LEFT: FORM */}
          <GridItem>
            <Box
              bg={cardBg}
              borderWidth="1px"
              borderColor={borderColor}
              borderRadius="2xl"
              p={{ base: 4, md: 6 }}
              boxShadow="lg"
            >
              <form
                onSubmit={handleSubmit(onSubmit)}
                encType="multipart/form-data"
              >
                {/* BASIC INFO */}
                <Stack spacing={1} mb={5}>
                  <HStack spacing={2}>
                    <Icon as={FiFileText} boxSize={4} color="purple.400" />
                    <Text
                      fontSize="xs"
                      textTransform="uppercase"
                      color={subtleText}
                    >
                      Step 1 · Basic Info
                    </Text>
                  </HStack>
                  <Heading size="sm">Title & Intro</Heading>
                  <Text fontSize="sm" color={subtleText}>
                    Main heading, URL slug, aur intro paragraph yahan se set
                    karo.
                  </Text>
                </Stack>

                <Flex gap={4} direction={{ base: 'column', md: 'row' }}>
                  <FormControl
                    isRequired
                    isInvalid={errors.mainHeading}
                    flex="2"
                  >
                    <FormLabel fontSize="sm">Main Heading</FormLabel>
                    <Input
                      size="sm"
                      borderRadius="lg"
                      placeholder="5 Lingerie Styling Tips Every Woman Should Know"
                      {...register('mainHeading', {
                        required: 'Main heading is required',
                      })}
                    />
                    {errors.mainHeading && (
                      <Text fontSize="xs" color="red.400" mt={1}>
                        {errors.mainHeading.message}
                      </Text>
                    )}
                  </FormControl>

                  <FormControl flex="1">
                    <FormLabel fontSize="sm">Slug (URL)</FormLabel>
                    <Input
                      size="sm"
                      borderRadius="lg"
                      placeholder="lingerie-styling-tips-every-woman-should-know"
                      {...register('slug')}
                    />
                    <Text fontSize="xs" color={subtleText} mt={1}>
                      Optional. Backend se auto-generate bhi ho sakta hai agar
                      blank.
                    </Text>
                  </FormControl>
                </Flex>

                <FormControl
                  mt={4}
                  isRequired
                  isInvalid={errors.introParagraph}
                >
                  <FormLabel fontSize="sm">Intro Paragraph</FormLabel>
                  <Box
                    borderWidth="1px"
                    borderRadius="lg"
                    borderColor={borderColor}
                    p={2}
                  >
                    <Controller
                      name="introParagraph"
                      control={control}
                      rules={{ required: 'Intro paragraph is required' }}
                      defaultValue=""
                      render={({ field }) => (
                        <CKEditor
                          editor={ClassicEditor}
                          config={editorConfig}
                          data={field.value || ''}
                          onChange={(_, editor) => {
                            const data = editor.getData();
                            field.onChange(data);
                          }}
                          onBlur={field.onBlur}
                        />
                      )}
                    />
                  </Box>
                  {errors.introParagraph && (
                    <Text fontSize="xs" color="red.400" mt={1}>
                      {errors.introParagraph.message}
                    </Text>
                  )}
                </FormControl>

                <Divider my={6} />

                {/* IMAGES */}
                <Stack spacing={1} mb={4}>
                  <HStack spacing={2}>
                    <Icon as={FiImage} boxSize={4} color="pink.400" />
                    <Text
                      fontSize="xs"
                      textTransform="uppercase"
                      color={subtleText}
                    >
                      Step 2 · Images
                    </Text>
                  </HStack>
                  <Heading size="sm">Feature & Gallery Images</Heading>
                  <Text fontSize="sm" color={subtleText}>
                    Existing feature image dikh raha hai. New image select
                    karoge to wo replace ho jayega.
                  </Text>
                </Stack>

                <Flex gap={4} direction={{ base: 'column', md: 'row' }}>
                  <FormControl flex="1">
                    <FormLabel fontSize="sm">
                      Feature Image (optional)
                    </FormLabel>
                    <Input
                      type="file"
                      accept="image/*"
                      size="sm"
                      borderRadius="lg"
                      {...featureImageRegister}
                      onChange={(e) => {
                        featureImageRegister.onChange(e);
                        const file = e.target.files?.[0];
                        if (file) {
                          setFeaturePreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                    <Text fontSize="xs" color={subtleText} mt={1}>
                      If you don't upload, old image rahega.
                    </Text>
                  </FormControl>

                  <FormControl flex="1">
                    <FormLabel fontSize="sm">
                      Image Gallery (multiple)
                    </FormLabel>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      size="sm"
                      borderRadius="lg"
                      {...register('galleryImages')}
                    />
                    <Text fontSize="xs" color={subtleText} mt={1}>
                      Naye gallery images add karne ke liye yahan se select
                      karo.
                    </Text>
                  </FormControl>
                </Flex>

                <Divider my={6} />

                {/* SECTIONS H2–H5 */}
                <Stack spacing={1} mb={4}>
                  <HStack spacing={2}>
                    <Icon as={FiFileText} boxSize={4} color="blue.400" />
                    <Text
                      fontSize="xs"
                      textTransform="uppercase"
                      color={subtleText}
                    >
                      Step 3 · Sections (H2 – H5)
                    </Text>
                  </HStack>
                  <Heading size="sm">Content Blocks</Heading>
                  <Text fontSize="sm" color={subtleText}>
                    Har section ke liye ek heading (H2/H3/H4/H5) aur ek rich
                    text body.
                  </Text>
                </Stack>

                {/* H2 */}
                <Box mb={5}>
                  <FormControl mb={2}>
                    <FormLabel fontSize="sm">Heading 2</FormLabel>
                    <Input
                      placeholder="1. Understand Your Body Type"
                      size="sm"
                      borderRadius="lg"
                      {...register('heading2')}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm">Text (under Heading 2)</FormLabel>
                    <Box
                      borderWidth="1px"
                      borderRadius="lg"
                      borderColor={borderColor}
                      p={2}
                    >
                      <Controller
                        name="body2"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <CKEditor
                            editor={ClassicEditor}
                            config={editorConfig}
                            data={field.value || ''}
                            onChange={(_, editor) => {
                              const data = editor.getData();
                              field.onChange(data);
                            }}
                            onBlur={field.onBlur}
                          />
                        )}
                      />
                    </Box>
                  </FormControl>
                </Box>

                {/* H3 */}
                <Box mb={5}>
                  <FormControl mb={2}>
                    <FormLabel fontSize="sm">Heading 3</FormLabel>
                    <Input
                      placeholder="2. Choose the Right Fabric"
                      size="sm"
                      borderRadius="lg"
                      {...register('heading3')}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm">Text (under Heading 3)</FormLabel>
                    <Box
                      borderWidth="1px"
                      borderRadius="lg"
                      borderColor={borderColor}
                      p={2}
                    >
                      <Controller
                        name="body3"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <CKEditor
                            editor={ClassicEditor}
                            config={editorConfig}
                            data={field.value || ''}
                            onChange={(_, editor) => {
                              const data = editor.getData();
                              field.onChange(data);
                            }}
                            onBlur={field.onBlur}
                          />
                        )}
                      />
                    </Box>
                  </FormControl>
                </Box>

                {/* H4 */}
                <Box mb={5}>
                  <FormControl mb={2}>
                    <FormLabel fontSize="sm">Heading 4</FormLabel>
                    <Input
                      placeholder="3. Color & Mood Matching"
                      size="sm"
                      borderRadius="lg"
                      {...register('heading4')}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm">Text (under Heading 4)</FormLabel>
                    <Box
                      borderWidth="1px"
                      borderRadius="lg"
                      borderColor={borderColor}
                      p={2}
                    >
                      <Controller
                        name="body4"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <CKEditor
                            editor={ClassicEditor}
                            config={editorConfig}
                            data={field.value || ''}
                            onChange={(_, editor) => {
                              const data = editor.getData();
                              field.onChange(data);
                            }}
                            onBlur={field.onBlur}
                          />
                        )}
                      />
                    </Box>
                  </FormControl>
                </Box>

                {/* H5 */}
                <Box mb={5}>
                  <FormControl mb={2}>
                    <FormLabel fontSize="sm">Heading 5</FormLabel>
                    <Input
                      placeholder="4. Styling Tips & Layering"
                      size="sm"
                      borderRadius="lg"
                      {...register('heading5')}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm">Text (under Heading 5)</FormLabel>
                    <Box
                      borderWidth="1px"
                      borderRadius="lg"
                      borderColor={borderColor}
                      p={2}
                    >
                      <Controller
                        name="body5"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <CKEditor
                            editor={ClassicEditor}
                            config={editorConfig}
                            data={field.value || ''}
                            onChange={(_, editor) => {
                              const data = editor.getData();
                              field.onChange(data);
                            }}
                            onBlur={field.onBlur}
                          />
                        )}
                      />
                    </Box>
                  </FormControl>
                </Box>

                <Divider my={6} />

                {/* CONCLUSION */}
                <Stack spacing={1} mb={4}>
                  <Text
                    fontSize="xs"
                    textTransform="uppercase"
                    color={subtleText}
                  >
                    Step 4 · Conclusion
                  </Text>
                  <Heading size="sm">Wrap-up</Heading>
                </Stack>

                <FormControl isRequired isInvalid={errors.conclusion}>
                  <FormLabel fontSize="sm">Final Conclusion</FormLabel>
                  <Box
                    borderWidth="1px"
                    borderRadius="lg"
                    borderColor={borderColor}
                    p={2}
                  >
                    <Controller
                      name="conclusion"
                      control={control}
                      rules={{ required: 'Conclusion is required' }}
                      defaultValue=""
                      render={({ field }) => (
                        <CKEditor
                          editor={ClassicEditor}
                          config={editorConfig}
                          data={field.value || ''}
                          onChange={(_, editor) => {
                            const data = editor.getData();
                            field.onChange(data);
                          }}
                          onBlur={field.onBlur}
                        />
                      )}
                    />
                  </Box>
                  {errors.conclusion && (
                    <Text fontSize="xs" color="red.400" mt={1}>
                      {errors.conclusion.message}
                    </Text>
                  )}
                </FormControl>

                <Divider my={6} />

                {/* SEO SECTION */}
                <Stack spacing={1} mb={4}>
                  <HStack spacing={2}>
                    <Icon as={FiSettings} boxSize={4} color="green.400" />
                    <Text
                      fontSize="xs"
                      textTransform="uppercase"
                      color={subtleText}
                    >
                      Step 5 · SEO Settings
                    </Text>
                  </HStack>
                  <Heading size="sm">SEO & Meta</Heading>
                  <Text fontSize="sm" color={subtleText}>
                    SEO title, meta tags, keywords aur schema markup yahan se
                    control karo.
                  </Text>
                </Stack>

                <Flex gap={4} direction={{ base: 'column', md: 'row' }}>
                  <FormControl flex="1">
                    <FormLabel fontSize="sm">SEO Title</FormLabel>
                    <Input
                      size="sm"
                      borderRadius="lg"
                      placeholder="Best Lingerie Styling Tips for Indian Women"
                      {...register('seoTitle')}
                    />
                    <Text fontSize="xs" color={subtleText} mt={1}>
                      Search engines par dikhne wala main SEO title.
                    </Text>
                  </FormControl>

                  <FormControl flex="1">
                    <FormLabel fontSize="sm">SEO Description</FormLabel>
                    <Textarea
                      rows={3}
                      size="sm"
                      borderRadius="lg"
                      placeholder="Discover how to choose, style and care for your lingerie with these easy tips..."
                      {...register('seoDescription')}
                    />
                    <Text fontSize="xs" color={subtleText} mt={1}>
                      Search result snippet ke liye ~150–160 characters.
                    </Text>
                  </FormControl>
                </Flex>

                <Flex gap={4} direction={{ base: 'column', md: 'row' }} mt={4}>
                  <FormControl flex="1">
                    <FormLabel fontSize="sm">Meta Title</FormLabel>
                    <Input
                      size="sm"
                      borderRadius="lg"
                      placeholder="House of Intimacy | Lingerie Styling Tips"
                      {...register('metaTitle')}
                    />
                    <Text fontSize="xs" color={subtleText} mt={1}>
                      Browser tab title. SEO title jaisa bhi rakh sakte ho.
                    </Text>
                  </FormControl>

                  <FormControl flex="1">
                    <FormLabel fontSize="sm">Meta Description</FormLabel>
                    <Textarea
                      rows={3}
                      size="sm"
                      borderRadius="lg"
                      placeholder="Practical lingerie styling tips for everyday comfort and confidence..."
                      {...register('metaDescription')}
                    />
                    <Text fontSize="xs" color={subtleText} mt={1}>
                      &lt;meta name=&quot;description&quot;&gt; ke liye text.
                    </Text>
                  </FormControl>
                </Flex>

                <FormControl mt={4}>
                  <FormLabel fontSize="sm">
                    Keywords (comma separated)
                  </FormLabel>
                  <Input
                    size="sm"
                    borderRadius="lg"
                    placeholder="lingerie styling, bra fitting, House of Intimacy, HOI blog"
                    {...register('keywords')}
                  />
                  <Text fontSize="xs" color={subtleText} mt={1}>
                    Example: lingerie, bra, shapewear, hoi, house of intimacy
                  </Text>
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel fontSize="sm">Schema Markup (JSON-LD)</FormLabel>
                  <Textarea
                    rows={6}
                    size="sm"
                    borderRadius="lg"
                    placeholder={`{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "5 Lingerie Styling Tips Every Woman Should Know",
  "author": "House of Intimacy"
}`}
                    {...register('schemaMarkup')}
                  />
                  <Text fontSize="xs" color={subtleText} mt={1}>
                    Raw JSON-LD paste karo (Google rich results ke liye).
                  </Text>
                </FormControl>

                <Flex justify="flex-end" mt={8}>
                  <Button
                    leftIcon={<FiSave />}
                    colorScheme="purple"
                    type="submit"
                    borderRadius="full"
                    px={8}
                    isLoading={isSubmitting}
                  >
                    Save Changes
                  </Button>
                </Flex>
              </form>
            </Box>
          </GridItem>

          {/* RIGHT: LIVE PREVIEW */}
          <GridItem>
            <Box
              bg={cardBg}
              borderWidth="1px"
              borderColor={borderColor}
              borderRadius="2xl"
              p={4}
              boxShadow="xl"
              position="sticky"
              top="90px"
            >
              <HStack justify="space-between" mb={3}>
                <Box>
                  <Text fontSize="xs" color={subtleText} mb={1}>
                    Live Preview
                  </Text>
                  <Text fontSize="sm" fontWeight="semibold">
                    Blog Card Preview
                  </Text>
                </Box>
                <Badge
                  colorScheme="purple"
                  borderRadius="full"
                  variant="subtle"
                >
                  Preview Only
                </Badge>
              </HStack>

              <Box
                borderWidth="1px"
                borderColor={borderColor}
                borderRadius="xl"
                overflow="hidden"
              >
                {/* Image */}
                <Box
                  h="240px"
                  bgGradient="linear(to-br, purple.500, pink.400)"
                  position="relative"
                >
                  {featurePreview ? (
                    <Image
                      src={featurePreview}
                      alt={mainHeadingWatch}
                      objectFit="cover"
                      w="100%"
                      h="100%"
                    />
                  ) : (
                    <Flex
                      w="100%"
                      h="100%"
                      align="center"
                      justify="center"
                      direction="column"
                      gap={1}
                      color="whiteAlpha.800"
                    >
                      <Icon as={FiImage} boxSize={6} />
                      <Text fontSize="xs">Feature image preview</Text>
                      <Text fontSize="xs" opacity={0.7}>
                        Existing feature image ya nayi upload yahan show hogi
                      </Text>
                    </Flex>
                  )}

                  <Badge
                    position="absolute"
                    top={3}
                    left={3}
                    colorScheme="pink"
                    borderRadius="full"
                    px={2}
                    py={1}
                    fontSize="0.6rem"
                    textTransform="uppercase"
                  >
                    Blog
                  </Badge>
                </Box>

                {/* Text preview */}
                <Box p={4}>
                  {slugWatch && (
                    <Text
                      fontSize="xs"
                      color={subtleText}
                      textTransform="lowercase"
                      mb={1}
                    >
                      /blog/{slugWatch}
                    </Text>
                  )}

                  <Heading size="sm" mb={2} noOfLines={2}>
                    {mainHeadingWatch}
                  </Heading>

                  {introWatch && (
                    <Box mb={3}>
                      <Text fontSize="xs" color={subtleText} mb={1}>
                        Intro snippet:
                      </Text>
                      <Box
                        fontSize="sm"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                        dangerouslySetInnerHTML={{ __html: introWatch }}
                      />
                    </Box>
                  )}

                  {conclusionWatch && (
                    <>
                      <Divider my={3} />
                      <Text fontSize="xs" color={subtleText} mb={1}>
                        Conclusion snippet:
                      </Text>
                      <Box
                        fontSize="sm"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                        dangerouslySetInnerHTML={{ __html: conclusionWatch }}
                      />
                    </>
                  )}
                </Box>
              </Box>
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </Box>
  );
};

export default EditBlog;
